import path = require('path');

/** Information about a League client (LCU) instance.
 *
 * This is guaranteed to be JSON-serializable.
 */
export interface LcuInstanceInfoJson {
  /** The password used to authenticate to the RPC server. */
  readonly password: string | null;
  /** The installation directory that hosts the lock file. */
  readonly path: string | null;
  /** The RPC server port. */
  readonly port: number | null;
  /** The protocol used by the RPC server. Should be https. */
  readonly protocol: string | null;
  /** Unknown use. Exposed in api and in --remoting-auth-token CLI arg. */
  readonly token: string | null;
}

/** Information about a League client (LCU) instance. */
export class LcuInstanceInfo implements LcuInstanceInfoJson {
  /** The password used to authenticate to the RPC server. */
  public readonly password: string | null;
  /** The installation directory that hosts the lock file. */
  public readonly path: string | null;
  /** The RPC server port. */
  public readonly port: number | null;
  /** The protocol used by the RPC server. Should be https. */
  public readonly protocol: string | null;
  /** Unknown use. Exposed in api and in --remoting-auth-token CLI arg. */
  public readonly token: string | null;

  /** Create an instance from JSON data. */
  public constructor(jsonInfo: LcuInstanceInfoJson) {
    this.password = jsonInfo.password;
    this.path = jsonInfo.path;
    this.port = jsonInfo.port;
    this.protocol = jsonInfo.protocol;
    this.token = jsonInfo.token;
  }

  /** Serialize to JSON. */
  public toJSON(): LcuInstanceInfoJson {
    return {
      password: this.password,
      path: this.path,
      port: this.port,
      protocol: this.protocol,
      token: this.token,
    };
  }

  /** Returns an instance with missing fields populated from the argument. */
  public withMissingInfo(jsonInfo: LcuInstanceInfoJson): LcuInstanceInfo {
    const newPassword = (this.password === null) ? jsonInfo.password
                                                 : this.password;
    const newPath = (this.path === null) ? jsonInfo.path : this.path;
    const newPort = (this.port === null) ? jsonInfo.port : this.port;
    const newProtocol = (this.protocol === null) ? jsonInfo.protocol
                                                 : this.protocol;
    const newToken = (this.token === null) ? jsonInfo.token : this.token;

    // Avoid creating a duplicate object with the same values.
    if (newPassword === this.password && newPath === this.path &&
        newPort === this.port && newProtocol === this.protocol &&
        newToken === this.token) {
      return this;
    }

    return new LcuInstanceInfo({
      password: newPassword,
      path: newPath,
      port: newPort,
      protocol: newProtocol,
      token: newToken,
    });
  }

  /** Return an identifier used by watchers to de-duplicate League clients.
   *
   * This is intended to reduce the CPU usage of the watching code, by
   * eliminating duplicate connection attempts to the same client. Due to
   * incomplete information, the same LCU instance may end up with multiple
   * keys.
   *
   * Code that deals with known-good clients should use the path to identify a
   * client.
   */
  public watcherCacheKey(): string | null {
    if (this.path !== null) {
      return `Path:${this.port}:${this.path}`;
    } else if (this.port !== null) {
      const httpPassword = (this.password !== null) ? this.password
                                                    : this.token;
      if (httpPassword !== null) {
        return `Token:${this.port}:${httpPassword}`;
      }
    }
    return null;
  }

  /** The root URL of the League client's HTTP API server.
   *
   * May return null due to incomplete information. Guaranteed to return a
   * non-null value if hasHttpServerInfo() returns true.
   */
  public rootApiUrl(): string | null {
    if (this.port === null || this.protocol === null) {
      return null;
    }
    return `${this.protocol}://127.0.0.1:${this.port}`;
  }

  /** The WebSocket URL of the League client's WAMP server.
   *
   * May return null due to incomplete information. Guaranteed to return a
   * non-null value if hasHttpServerInfo() returns true.
   */
  public webSocketUrl(): string | null {
    if (this.port === null || this.protocol === null) {
      return null;
    }
    const protocol = (this.protocol === 'https') ? 'wss' : 'ws';
    return `${protocol}://127.0.0.1:${this.port}`;
  }

  /** The value of the Authorization HTTP header to be used in API calls.
   *
   * May return null due to incomplete information. Guaranteed to return a
   * non-null value if hasHttpServerInfo() returns true.
   */
  public authorizationHeader(): string | null {
    let httpPassword: string;
    if (this.password !== null) {
      httpPassword = this.password;
    } else if (this.token !== null) {
      httpPassword = this.token;
    } else {
      return null;
    }
    return `Basic ${btoa(`riot:${httpPassword}`)}`;
  }

  /** True if this has enough information to connect to an LCU API server. */
  public hasHttpServerInfo(): boolean {
    return this.port !== null && this.protocol !== null &&
           (this.password !== null || this.token !== null);
  }

  /** The absolute path to the League client's lock file.
   *
   * The lock file contains all the information needed to connect to the HTTP
   * API server.
   *
   * May return null due to incomplete information. Guaranteed to return a
   * non-null value if hasLockFileInfo() returns true.
   */
  public lockFilePath(): string | null {
    if (this.path === null) {
      return null;
    }

    return path.join(this.path, 'lockfile');
  }

  /** True if this has enough information to find the LCU lockfile. */
  public hasLockFileInfo(): boolean {
    return this.path !== null;
  }
}
