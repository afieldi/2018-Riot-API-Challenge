import LeagueConnection from "./league/league";

export async function RunServerWatcher(PORT: number, PWD: string)
{
    console.log("server being watched");
    (async () =>
    {
        const league = new LeagueConnection(PORT, PWD);
        try {
            // Wait for user to log in.
            while (true) {
                let resp = await league.request("/lol-summoner/v1/current-summoner");
                if (resp.status !== 404)
                    break;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        catch(exception)
        {
            console.log(exception)
        }


    })().catch(console.error);
}
