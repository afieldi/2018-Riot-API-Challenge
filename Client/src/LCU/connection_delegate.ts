import { LcuConnection } from './connection';

/** Receives LCU client list changes from watcher classes.
 *
 * This is used by LcuLockFileWatcher and LcuProcessWatcher.
 */
export interface LcuConnectionDelegate {
  /** Called after successfully connecting to an LCU instance. */
  online(connection: LcuConnection): void;

  /** Called after losing the connection to an LCU instance. */
  offline(connection: LcuConnection): void;
}
