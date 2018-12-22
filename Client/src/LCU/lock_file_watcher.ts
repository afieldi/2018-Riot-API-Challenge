import fs = require('fs');
import path = require('path');
import util = require('util');

import { LcuInstanceInfo, LcuInstanceInfoJson } from './instance_info';
import { LcuInstanceWatcherDelegate } from './instance_watcher_delegate';

/** Promisified version of fs.readFile. */
const readFile = util.promisify(fs.readFile);

/** Looks for a League client lock file at a designated path. */
export class LcuLockFileWatcher {
  /** The League client (LCU) installation directory. */
  private readonly clientPath: string;
  /** The path of the lock file to be monitored. */
  private readonly lockFilePath: string;
  /** Baseline information for newly reported instances. */
  private readonly clientBase: LcuInstanceInfoJson;
  /** The delegate receives updates to the information in the lock file. */
  private readonly delegate: LcuInstanceWatcherDelegate;
  /** The LcuInfo passed to the last found call. */
  private lastClient: LcuInstanceInfo | null;
  /** Used to watch the lock file for changes.
   *
   * This is null if not watching for changes.
   */
  private watcher: fs.FSWatcher | null;

  public constructor(client: LcuInstanceInfo,
                     delegate: LcuInstanceWatcherDelegate) {
    const clientPath = client.path;
    if (clientPath === null) {
      throw new TypeError('The client does not have lock file information');
    }

    this.clientBase = client.toJSON();
    this.delegate = delegate;
    this.clientPath = clientPath;
    this.lockFilePath = path.join(clientPath, 'lockfile');
    this.lastClient = null;
    this.watcher = null;
  }

  /** Parse LCU client information from the LCU lock file.
   *
   * Exposed for testing. Clients should use start() / stop() and implement the
   * delegate interface.
   */
  public static parseLockFile(lockText: string): LcuInstanceInfo | null {
    const components = lockText.split(':');
    if (components.length < 5) {
      return null;
    }

    return new LcuInstanceInfo({
      password: components[3],
      path: null,
      port: parseInt(components[2], 10),
      protocol: components[4],
      token: null,
    });
  }

  public start(): void {
    if (this.watcher !== null) {
      return;
    }
    // On Windows, fs.watch() seems to work when given lockFilePath (the file
    // we need, as opposed to its directory). On Mac, when fs.watch() is given
    // lockFilePath, it loses track of the file on the first delete.
    //
    // So, we definitely need to pass clientPath (the directory) for Mac. We
    // currently do the same for Windows because the extra work is small (the
    // files in the LCU root directory don't generally change, even on updates)
    // compared to the risk of not working correctly on untested versions of
    // Windows.
    this.watcher = fs.watch(
        this.clientPath,
        {persistent: false, recursive: false, encoding: 'utf8'});

    this.watcher.on('change', (_: string, filename: string) => {
      if (!filename.endsWith('lockfile')) {
        return;
      }
      this.refreshFileInfo();  // Promise ignored intentionally.
    });
    this.watcher.on('error', (error: Error) => {
      console.error(error);
    });

    this.refreshFileInfo();  // Promise ignored intentionally.
  }

  public stop(): void {
    if (this.watcher === null) {
      return;
    }
    this.watcher.close();
    this.watcher = null;
  }

  /** Poll the LCU lock file to update the state of this watcher.
   *
   * This method should only be called when the lock file is known to have
   * changed.
   */
  private async refreshFileInfo(): Promise<void> {
    let lockText: string | null = null;
    try {
      lockText = await readFile(this.lockFilePath, {encoding: 'utf8'});
    } catch (readError) {
      this.setClient(null);
      return;
    }

    const client = LcuLockFileWatcher.parseLockFile(lockText);
    this.setClient(client);
  }

  /** Update the state of this watcher. */
  private setClient(client: LcuInstanceInfo | null): void {
    if (client === null) {
      if (this.lastClient === null) {
        return;
      }

      const lastClient = this.lastClient;
      this.lastClient = null;
      this.delegate.lost(lastClient);
      return;
    }

    if (this.lastClient !== null &&
        this.lastClient.password === client.password) {
      return;
    }

    const newClient = client.withMissingInfo(this.clientBase);
    this.lastClient = newClient;
    this.delegate.found(newClient);
  }
}
