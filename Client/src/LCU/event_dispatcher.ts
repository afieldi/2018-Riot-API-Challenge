import { LcuConnection } from './connection';

export type LcuEventListener = (topic: string, payload: any) => void;

/** Manages WAMP events across multiple connections and listeners. */
export class LcuEventDispatcher {
  /** Maps WAMP event topics to registered listeners. */
  private listeners: Map<string, Set<LcuEventListener>>;
  /** Active connections. */
  private connections: Set<LcuConnection>;

  public constructor() {
    this.listeners = new Map();
    this.connections = new Set();
  }

  /** Register a listener for WAMP events with the given topic.
   *
   * This method is idempotent. In other words, a previously added listener
   * will be ignored.
   */
  public addListener(topic: string, listener: LcuEventListener): void {
    let topicListeners = this.listeners.get(topic);
    if (topicListeners === undefined) {
      topicListeners = new Set();
      this.listeners.set(topic, topicListeners);
      this.wampSubscribe(topic);
    }

    topicListeners.add(listener);
  }

  /** Unregister a previously registered WAMP event listener.
   *
   * This method is idempotent. In other words, a listener that was not
   * registered will be ignored.
   */
  public removeListener(topic: string, listener: LcuEventListener): void {
    const topicListeners = this.listeners.get(topic);
    if (topicListeners === undefined) {
      return;
    }

    topicListeners.delete(listener);
    if (topicListeners.size !== 0) {
      return;
    }

    // No listeners left for the given topic.
    this.listeners.delete(topic);
    this.wampUnsubscribe(topic);
  }

  /** Register an active connection with this dispatcher.
   *
   * The connection must be ready to create subscriptions immediately.
   */
  public addConnection(connection: LcuConnection): void {
    if (this.connections.has(connection)) {
      return;
    }

    this.connections.add(connection);
    for (const kvp of this.listeners) {
      const topic = kvp[0];
      connection.wampSubscribe(topic);
    }
  }

  /** Unsubscribe a connection from this dispatcher. */
  public removeConnection(connection: LcuConnection): void {
    this.connections.delete(connection);
  }

  /** Dispatch an event to all interested listeners. */
  public dispatchEvent(topic: string, payload: any): void {
    const topicListeners = this.listeners.get(topic);
    if (topicListeners === undefined) {
      return;
    }

    for (const listener of topicListeners) {
      try {
        listener(topic, payload);
      } catch (listenerError) {
        console.error(`Exception in WAMP listener for ${topic}`);
        console.error(listenerError);

        // Ignore errors and continue dispatch.
        console.error(listenerError);
      }
    }
  }

  /** Have all registered connections subscribe to the given topic. */
  private wampSubscribe(topic: string): void {
    for (const connection of this.connections) {
      connection.wampSubscribe(topic);
    }
  }

  /** Have all registered connections unsubscribe from the given topic. */
  private wampUnsubscribe(topic: string): void {
    for (const connection of this.connections) {
      connection.wampUnsubscribe(topic);
    }
  }
}
