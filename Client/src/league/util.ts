import * as child_process from "child_process";

/**
 * Tries to find a running LeagueClientUx process and returns it's command line.
 */
export function getUxArguments(): Promise<string | undefined> {
    return new Promise(resolve => {
        child_process.exec(
            "WMIC PROCESS WHERE name='LeagueClientUx.exe' GET commandline",
            (err, stdout, stderr) => {
                // If there was an error or stderr isn't empty, abort.
                if (err || !stdout || stderr) return resolve();
                if (!stdout.includes("CommandLine")) return resolve();

                resolve(stdout.replace("CommandLine", "").replace(/\n/g, "").trim());
            }
        );
    });
}

/**
 * Stops all league processes, if it is currently running.
 */
export function stopLeague() {
    child_process.execSync(`WMIC PROCESS WHERE name='LeagueClient.exe' DELETE`);
}

/**
 * Starts a new league instance with the specified port and remoting password.
 */
export function startFoundation(port: number, password: string) {
    child_process.execSync(`"C:/Riot Games/League of Legends/LeagueClient.exe" --remoting-auth-token=${password} --app-port=${port} --allow-multiple-clients`);// --headless`);
}

/**
 * Starts the UX process with the provided commandline.
 */
export function startUx(commandLine: string) {
    const [ , cwd ] = /"(.*)?LeagueClientUx\.exe"/.exec(commandLine)!;
    console.log("Starting " + commandLine + " in " + cwd);
    child_process.exec(commandLine, {
        cwd
    }, () => {
        // League exited, so can we.
        process.exit(0);
    });
}

export function stopLeagueRenderProccess()
{
    child_process.exec(`WMIC PROCESS WHERE name='LeagueClientUx.exe' DELETE`);
}

