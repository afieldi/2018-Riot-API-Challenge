import child_process = require('child_process');
import util = require('util');

import { LcuInstanceInfo } from './instance_info';

/* Promisified version of child_process.exec. */
const exec = util.promisify(child_process.exec);

const kIsWindows = process.platform === 'win32';

/** Polls the OS for running LCU processes.
 *
 * This is an implementation detail of LcuProcessDetector, which exposes an
 * event-based interface.
 */
export abstract class LcuProcessLister {
  /** Factory method that returns OS-dependent LCU polling code. */
  public static createLister(): LcuProcessLister {
    if (kIsWindows) {
      return new WindowsProcessLister();
    }
    return new UnixProcessLister();
  }

  /** Polls the OS for the currently running LCU processes. */
  public async listClients(): Promise<LcuInstanceInfo[]> {
    if (kIsWindows) {
      const commandList = await this.runListCommand();
      return this.extractClients(commandList);
    } else {
      const commandList = await this.runListCommand();
      return this.extractClients(commandList);
    }
  }

  protected abstract async runListCommand(): Promise<string>;
  protected abstract parseClient(command: string): LcuInstanceInfo | null;

  /** Extract League client information from the runListCommand() output. */
  private extractClients(commandList: string): LcuInstanceInfo[] {
    const commands = commandList.split('\n').filter(line => line.length > 0);
    const result: LcuInstanceInfo[] = [];
    for (const command of commands) {
      const client = this.parseClient(command);
      if (client === null) {
        continue;
      }

      // Don't report the client if we don't know enough to connect to it.
      if (client.watcherCacheKey() === null) {
        continue;
      }
      result.push(client);
    }

    return result;
  }
}

/** Unix-specific process polling logic. */
class UnixProcessLister extends LcuProcessLister {
  public async runListCommand(): Promise<string> {
    // PS accepts UNIX-style arguments both on Mac and Linux.
    //   -e shows all processes
    //   -w twice disables truncating to terminal width
    //   -o sets a custom format.
    //     args displays the entire command line (argv)
    //     = clears the value's header, removing the header from the output
    const command = 'ps -ewwo args=';
    const execResult = await exec(command);
    return execResult.stdout;
  }

  // Extract LCU information from a line in the output of a ps command.
  public parseClient(command: string): LcuInstanceInfo | null {
    if (command.indexOf('LeagueClient') === -1) {
      return null;
    }
    command = command.trim();

    const portMatch = /--app-port=(\d+)/.exec(command);
    const port = (portMatch === null) ? null : parseInt(portMatch[1], 10);

    const tokenMatch = /--remoting-auth-token=([^ ]+)/.exec(command);
    const token = (tokenMatch === null) ? null : tokenMatch[1];

    const pathMatch = /--install-directory=(.+?) (--|$)/.exec(command);
    const path = (pathMatch === null) ? null : pathMatch[1];

    return new LcuInstanceInfo({
      password: null, path, port, protocol: null, token,
    });
  }
}

/** Windows-specific process polling logic. */
class WindowsProcessLister extends LcuProcessLister {
  public async runListCommand(): Promise<string> {
    const command =
        `WMIC PROCESS WHERE 'name LIKE "%LeagueClient%"' GET CommandLine`;
    const execResult = await exec(command);
    return execResult.stdout;
  }

  // Extract LCU information from a line in the output of a WMIC command.
  public parseClient(command: string): LcuInstanceInfo | null {
    if (command.indexOf('LeagueClient') === -1) {
      return null;
    }
    command = command.trim();

    const portMatch = /--app-port=(\d+)/.exec(command);
    const port = (portMatch === null) ? null : parseInt(portMatch[1], 10);

    const tokenMatch = /--remoting-auth-token=([^" ]+)/.exec(command);
    const token = (tokenMatch === null) ? null : tokenMatch[1];

    const pathMatch = /"--install-directory=([^"]+)"/.exec(command);
    const path = (pathMatch === null) ? null : pathMatch[1];

    return new LcuInstanceInfo({
      password: null, path, port, protocol: null, token,
    });
  }
}
