import request = require('request-promise-native');
import WebSocket = require('ws');

import { LcuConnectionDelegate } from './connection_delegate';
import { LcuEventDispatcher } from './event_dispatcher';
import { LcuInstanceInfo } from './instance_info';

/** WAMP 1.0 message types.
 *
 * WAMP 1.0 is deprecated. The RFC that Google turns up is for an entirely
 * different version.
 */
const enum WampMessageType {
  kWelcome = 0,  // [0, sessionId, version=1, extra]
  kPrefix = 1,  // Not used by LCU. [1, prefix, uri]
  kCall = 2,  // Not used by LCU. [2, callId, url, args...]
  kCallResult = 3,  // Not used by LCU. [3, callId, result]
  kCallError = 4,  // Not used by LCU. [4, callId, uri, message]
  kSubscribe = 5,  // [5, uri]
  kUnsubscribe = 6,  // [6, uri]
  kPublish = 7,  // Not used by LCU.
  kEvent = 8,  // [8, event, data]
}

export class LcuConnection {
  /** The LCU instance given to the constructor. */
  public readonly client: LcuInstanceInfo;
  /** If true, the LCU instance can be assumed to have a good path.  */
  public wasEverOnline: boolean;

  /** The delegate receives connection state change notifications. */
  private readonly delegate: LcuConnectionDelegate;
  /** The dispatcher that manages WAMP events. */
  private readonly eventDispatcher: LcuEventDispatcher;
  /** The ID of this connection's WAMP session. null if disconnected. */
  private wampSession: string | null;
  /** Root URL for the LCU HTTP server. */
  private readonly rootUrl: string;
  /** HTTP headers used in LCU requests. */
  private readonly bodyHeaders: { [name: string]: string };
  private readonly bodyLessHeaders: { [name: string]: string };
  /** ws connection to the LCU WAMP server. */
  private readonly socket: WebSocket;

  /** Immediately starts a connection to the given LCU instance. */
  public constructor(client: LcuInstanceInfo,
                     eventDispatcher: LcuEventDispatcher,
                     delegate: LcuConnectionDelegate) {
    this.client = client;
    this.delegate = delegate;
    this.eventDispatcher = eventDispatcher;
    this.wampSession = null;
    this.wasEverOnline = false;

    let rootUrl = client.rootApiUrl();
    const wsUrl = client.webSocketUrl();
    const authorizationHeader = client.authorizationHeader();
    if (rootUrl === null || wsUrl === null || authorizationHeader === null) {
      throw new TypeError('Client does not have API server information');
    }
    if (rootUrl.endsWith('/')) {
      rootUrl = rootUrl.substring(0, rootUrl.length - 1);
    }
    this.rootUrl = rootUrl;
    this.bodyLessHeaders = {
      Accept: 'application/json',
      Authorization: authorizationHeader,
    };
    this.bodyHeaders = {
      Accept: 'application/json',
      Authorization: authorizationHeader,
      ContentType: 'application/json',
    };

    this.socket = new WebSocket(wsUrl, 'wamp', {
      headers: {
        Authorization: authorizationHeader,
      },
      rejectUnauthorized: false,
    });
    this.socket.onclose = this.onWsClose.bind(this);
    this.socket.onerror = this.onWsError.bind(this);
    this.socket.onmessage = this.onWsMessage.bind(this);
    this.socket.onopen = this.onWsOpen.bind(this);
  }

  /** Sends a WAMP subscribe command.
   *
   * High-level clients should use EventDispatcher instead of calling this
   * directly.
   */
  public wampSubscribe(topic: string): void {
    if (this.wampSession === null) {
      return;
    }

    const message = [WampMessageType.kSubscribe, topic];
    this.socket.send(JSON.stringify(message));
  }

  /** Sends a WAMP unsubscribe command. */
  public wampUnsubscribe(topic: string): void {
    if (this.wampSession === null) {
      return;
    }
    const message = [WampMessageType.kUnsubscribe, topic];
    this.socket.send(JSON.stringify(message));
  }

  public close(): void {
    this.socket.close();
  }

  public async request(httpMethod: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
                       url: string, data: any = null): Promise<any> {
    const body = await request({
      body: (data === null) ? data : JSON.stringify(data),
      headers: (data === null) ? this.bodyLessHeaders : this.bodyHeaders,
      json: false,
      method: httpMethod,
      rejectUnauthorized: false,
      simple: true,  // Get a rejection for non-200 HTTP status codes.
      url: this.rootUrl + url,
    });

    if (body.length === 0) {
      // Some API calls return an empty body instead of a JSON response.
      return null;
    }
    return JSON.parse(body);
  }

  private onWsClose(_: CloseEvent): void {
    console.log('WAMP WS closed');
    this.setWampSession(null);
  }

  private onWsError(error: Error): void {
    console.error('WAMP WS error');
    console.error(error);
  }

  private onWsMessage(event: MessageEvent): void {
    const message = JSON.parse(event.data);
    const messageType = message[0] as WampMessageType;

    switch (messageType) {
      case WampMessageType.kWelcome:
        const wampSession = message[1];
        if (typeof wampSession !== 'string') {
          return;
        }
        this.setWampSession(wampSession);
        break;
      case WampMessageType.kCallResult:
        break;
      case WampMessageType.kCallError:
        break;
      case WampMessageType.kEvent:
        const topic = message[1];
        if (typeof topic !== 'string') {
          return;
        }
        const payload: any = message[2];
        this.eventDispatcher.dispatchEvent(topic, payload);
        break;
      default:
        console.log('WAMP unknown message');
        console.log(message);
        // Unknown message type. Shrug.
        return;
    }
  }

  private onWsOpen(): void {
    console.log('WAMP WS open');
  }

  /** Called when this connection's WAMP session ID changes. */
  private setWampSession(wampSession: string | null): void {
    const oldSession = this.wampSession;
    this.wampSession = wampSession;

    if (oldSession === null) {
      if (wampSession !== null) {
        this.wasEverOnline = true;
        this.eventDispatcher.addConnection(this);
        this.delegate.online(this);
      } else if (!this.wasEverOnline) {
        // Issue an offline() notification to the delegate if we never issued
        // online() and we know this connection cannot go online.
        this.delegate.offline(this);
      }
    } else {
      if (wampSession === null) {
        this.eventDispatcher.removeConnection(this);
        this.delegate.offline(this);
      }
    }
  }
}
