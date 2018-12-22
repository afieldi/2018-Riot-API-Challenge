import { LcuConnection } from './connection';
import { LcuConnectionDelegate } from './connection_delegate';
import { LcuEventDispatcher } from './event_dispatcher';
import { LcuInstanceInfo } from './instance_info';
import { LcuInstanceWatcherDelegate } from './instance_watcher_delegate';
import { LcuLockFileWatcher } from './lock_file_watcher';
import { LcuProcessWatcher } from './process_watcher';

/** Monitors League client (LCU) instances on the system.
 *
 * Connection state changes are broadcast to the event dispatcher.
 */
export class LcuClientWatcher {
  /** Manages WAMP events for all clients discovered by this watcher. */
  private readonly eventDispatcher: LcuEventDispatcher;
  /** Delegate used with LCU connections. */
  private readonly connectionDelegate: LcuConnectionDelegate;
  /** Delegate used with lock file watchers. */
  private readonly lockWatcherDelegate: LcuInstanceWatcherDelegate;
  /** Cache of opened connections associated with file lock watchers. */
  private readonly lockConnections: Map<string, LcuConnection>;
  /** Cache of existing lock file watchers. */
  private readonly lockWatchers: Map<string, LcuLockFileWatcher>;
  /** Cache of online connections. */
  private readonly onlineConnections: Set<LcuConnection>;
  private readonly knownGoodPaths: Set<string>;

  /** Process-based watcher.
   *
   * This is only used while we have no LCU paths registered.
   */
  private processWatcher: LcuProcessWatcher;

  public constructor(eventDispatcher: LcuEventDispatcher) {
    this.eventDispatcher = eventDispatcher;
    this.connectionDelegate = {
      offline: this.onConnectionOffline.bind(this),
      online: this.onConnectionOnline.bind(this),
    };
    this.lockWatcherDelegate = {
      found: this.onClientLockFound.bind(this),
      lost: this.onClientLockLost.bind(this),
    };
    this.lockConnections = new Map();
    this.lockWatchers = new Map();
    this.onlineConnections = new Set();
    // TODO(pwnall): Read the known-good paths from disk.
    this.knownGoodPaths = new Set();
    this.processWatcher = new LcuProcessWatcher({
      found: this.onClientProcessFound.bind(this),
      lost: () => { return; },
    });

    if (this.knownGoodPaths.size === 0) {
      this.processWatcher.start();
    }
  }

  private onClientProcessFound(client: LcuInstanceInfo): void {
    if (client.hasLockFileInfo()) {
      this.maybeStartLockWatcher(client);
      return;
    }

    this.resolveClientWithoutPath(client);  // Promise intentionally ignored.
  }

  private onClientLockFound(client: LcuInstanceInfo): void {
    console.log(['lock-found', client]);

    // The lockfile watcher is so fast that it somtimes picks up a file change
    // before the LCU instance has a chance to open the WAMP WebSocket.
    //
    // We currently hack around this problem by delaying the creation of the
    // LcuConnection. A more robust solution would involve connection retries
    // with a limited number of trials and exponential backoff.
    const kStartupListenDelay = 500;
    setTimeout(
        () => {
          const key = client.watcherCacheKey();
          if (key === null || this.lockConnections.has(key)) {
            return;
          }
          const connection = new LcuConnection(client, this.eventDispatcher,
                                               this.connectionDelegate);
          this.lockConnections.set(key, connection);
        },
        kStartupListenDelay);
  }

  private onClientLockLost(client: LcuInstanceInfo): void {
    console.log(['lock-lost', client]);
    const key = client.watcherCacheKey();
    if (key === null) {
      return;
    }
    const connection = this.lockConnections.get(key);
    if (connection === undefined) {
      return;
    }
    connection.close();
    this.lockConnections.delete(key);
  }

  private onConnectionOnline(connection: LcuConnection): void {
    console.log(['online', connection]);
    this.onlineConnections.add(connection);
    this.processWatcher.stop();
    const knownGoodPath = connection.client.path;
    if (knownGoodPath !== null) {
      this.addKnownGoodPath(knownGoodPath);
    }
    this.eventDispatcher.dispatchEvent('@-lcu-online',
                                       { connection, watcher: this });
  }
  private onConnectionOffline(connection: LcuConnection): void {
    console.log(['offline', connection]);

    // "as string" is safe because LcuConnection only accepts clients with
    // HTTP API server information, and these clients are guaranteed to have a
    // key.
    const key = connection.client.watcherCacheKey() as string;
    this.lockConnections.delete(key);
    if (!this.onlineConnections.delete(connection)) {
      return;
    }

    if (this.onlineConnections.size === 0 && this.knownGoodPaths.size === 0) {
      this.processWatcher.start();
    }
    this.eventDispatcher.dispatchEvent('@-lcu-offline',
                                       { connection, watcher: this });
  }

  /** Start watching a LCU lock file, if the path is not already watched.
   *
   * The given client must contain the information to identify a lock file.
   */
  private maybeStartLockWatcher(client: LcuInstanceInfo): void {
    const clientPath = client.path;
    if (clientPath === null) {
      throw new TypeError('Client does not have lock file information');
    }
    if (this.lockWatchers.has(clientPath)) {
      return;
    }
    const lockWatcher = new LcuLockFileWatcher(client,
                                               this.lockWatcherDelegate);
    this.lockWatchers.set(clientPath, lockWatcher);
    lockWatcher.start();
  }

  /** Attempts to locate a pathless client found by LcuProcessWatcher. */
  private async resolveClientWithoutPath(client: LcuInstanceInfo):
      Promise<boolean> {
    // If the client is missing protocol information, try HTTPS and then HTTP.
    if (client.protocol === null) {
      for (const protocol of ['https', 'http']) {
        const clientWithProtocol = client.withMissingInfo({
          password: null, path: null, port: null, protocol, token: null,
        });
        if (await this.resolveClientWithoutPath(clientWithProtocol)) {
          return true;
        }
      }
      return false;
    }

    if (!client.hasHttpServerInfo()) {
      return false;
    }

    let path: string;
    try {
      path = await this.getClientPath(client);
    } catch (readError) {
      console.error(readError);
      return false;
    }
    const clientWithPath = client.withMissingInfo({
      password: null, path, port: null, protocol: null, token: null });
    await this.maybeStartLockWatcher(clientWithPath);
    return true;
  }

  /** Retrieves the LCU installation path via the HTTP API.
   *
   * This method requires a client with enough info to connect to the HTTP API.
   */
  private async getClientPath(client: LcuInstanceInfo): Promise<string> {
    // Use a throwaway event dispatcher so no event is created
    const localEventDispatcher = new LcuEventDispatcher();

    const connection = await new Promise<LcuConnection>((resolve, reject) => {
      const newConnection = new LcuConnection(client, localEventDispatcher, {
        offline: () => { reject(new Error('Failed to connect')); },
        online: () => { resolve(newConnection); },
      });
    });

    try {
      return await connection.request('GET', '/data-store/v1/install-dir');
    } finally {
      connection.close();
    }
  }

  /** Records the finding that a LCU path is known to work. */
  private addKnownGoodPath(knownGoodPath: string): void {
    if (this.knownGoodPaths.has(knownGoodPath)) {
      return;
    }

    this.knownGoodPaths.add(knownGoodPath);
    // TODO(pwnall): Persist new known good path to disk.
  }
}
