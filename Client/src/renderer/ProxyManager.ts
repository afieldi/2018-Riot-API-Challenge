import {RunProxy} from "../renderer";

export async function ManageProxy()
{
    (async () =>
    {
        RunProxy();

    })().catch(console.error);
}

