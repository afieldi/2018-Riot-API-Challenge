import { LcuInstanceInfo } from './instance_info';

/** Receives LCU client list changes from watcher classes.
 *
 * This is used by LcuLockFileWatcher and LcuProcessWatcher.
 */
export interface LcuInstanceWatcherDelegate {
  /** Called after an LCU instance was found.
   *
   * The listener should be prepared to handle duplicate notifications.
   */
  found(client: LcuInstanceInfo): void;

  /** Called after a LCU instance is known to have gone away.
   *
   * The listener should be prepared to handle lost notifications that do not
   * have matching found notifications.
   */
  lost(client: LcuInstanceInfo): void;
}
