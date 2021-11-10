import { AccountServiceTokenResponse } from "../oauth";
import { Response } from "node-fetch";


export const handleErrors = (processName: string) => (async (response: Response): Promise<AccountServiceTokenResponse> => {
    if (!response.ok) {
        const errText = await response.text();
        throw Error(`Invalid response received (expected 200, received ${response.status}) when trying to ${processName}: ${errText}.`);
    }
    const tokenResponse = await response.json() as AccountServiceTokenResponse;
    if (!tokenResponse.access_token || !tokenResponse.expires_in) {
        throw Error(`Invalid response received when trying to ${processName} - server didn't return a properly formatted token.`);
    }

    return tokenResponse;
});