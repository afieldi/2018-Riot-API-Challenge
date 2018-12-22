import { LcuInstanceInfo } from './instance_info';
import { LcuInstanceWatcherDelegate } from './instance_watcher_delegate';
import { LcuProcessLister } from './process_lister';

/** Looks for the League client in the list of running processes. */
export class LcuProcessWatcher {
  /** The delegate receives updates to the LCU process list. */
  private readonly delegate: LcuInstanceWatcherDelegate;
  /** Time between successive polls of the running process list. */
  private readonly refreshMs: number;
  /** True if the detector is running.  */
  private running: boolean;
  /** Handle to the pending setTimeout() used to call loop(). */
  private loopTimeout: number | null;
  /** The clients that were reported as found. */
  private readonly foundClients: Map<string, LcuInstanceInfo>;
  /** Polls the OS for the list of currently running processes.
   *
   * This is an implementation detail. The interface is designed to allow
   * seamlessly switching to an implementation that gets process creation /
   * termination notifications from the OS.
   */
  private readonly lister: LcuProcessLister;

  /**
   * Creates a stopped process detector.
   *
   * The client should call start() when it is ready to receive League client
   * (LCU) list change notifications.
   *
   * @param delegate receives  (LCU) list change notifications; the
   *     delegate cannot be changed throughout the LcuProcessDetector's
   *     lifetime
   */
  public constructor(
      delegate: LcuInstanceWatcherDelegate,
      { refreshMs = 1000 }: { refreshMs?: number } = {}) {
    this.delegate = delegate;
    this.refreshMs = refreshMs;
    this.running = false;
    this.loopTimeout = null;
    this.foundClients = new Map();
    this.lister = LcuProcessLister.createLister();
  }

  /** Starts watching the list of LCU processes on this machine.
   *
   * The delegate will receive change notifications after this is called.
   * This method is idempotent.
   */
  public start(): void {
    if (this.running === true) {
      return;
    }
    this.running = true;

    this.loop();
  }

  /** Stops watching the list of LCU processes on this machine.
   *
   * The delegate will no longer receive change notifications after this is
   * called. This method is idempotent.
   */
  public stop(): void {
    if (this.running === false) {
      return;
    }
    this.running = false;

    if (this.loopTimeout !== null) {
      self.clearTimeout(this.loopTimeout);
      this.loopTimeout = null;
    }
  }

  private async loop(): Promise<void> {
    // If this was called by setTimeout(), the handler is now invalid.
    this.loopTimeout = null;

    // Check if stop() was called after loop() was scheduled to run.
    if (!this.running) {
      return;
    }

    const clients = await this.lister.listClients();
    this.updateLiveClients(clients);

    // Check if stop() was called while listing processes.
    if (!this.running) {
      return;
    }

    this.loopTimeout = self.setTimeout(() => { this.loop(); }, this.refreshMs);
  }

  private updateLiveClients(newClients: LcuInstanceInfo[]): void {
    const oldClientKeys = new Set<string>(this.foundClients.keys());

    for (const newClient of newClients) {
      const newClientKey = newClient.watcherCacheKey();
      if (newClientKey === null) {
        // Not enough information to report this client.
        // This only happens if the lister filtering does not work.
        continue;
      }

      if (oldClientKeys.delete(newClientKey)) {
        // Client was already reported as started.
        continue;
      }

      this.foundClients.set(newClientKey, newClient);
      this.delegate.found(newClient);
    }

    for (const oldClientKey of oldClientKeys) {
      // oldClient cannot be null because oldClientKeys is a subset of
      // foundClients.keys().
      const oldClient = this.foundClients.get(oldClientKey) as LcuInstanceInfo;

      this.foundClients.delete(oldClientKey);
      this.delegate.lost(oldClient);
    }
  }
}
