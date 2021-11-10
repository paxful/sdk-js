import fetch, { Request } from "node-fetch";
import { URLSearchParams } from "url";

import { AccountServiceTokenResponse, Credentials } from "../oauth";
import { ApiConfiguration } from "../ApiConfiguration";

const createOAuthRequestTokenUrl = (config: ApiConfiguration): Request => {
    const form = new URLSearchParams();
    form.append("grant_type", "client_credentials");
    form.append("client_id", config.clientId);
    form.append("client_secret", config.clientSecret);

    return new Request({
        href: `${process.env.PAXFUL_OAUTH_HOST}/oauth2/token`
    }, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accepts": "application/json"
        },
        agent: config.proxyAgent,
        body: form
    });
}

/**
 * Retrieves personal access token and refresh token.
 *
 * @param config
 */
export default function retrievePersonalCredentials(config: ApiConfiguration): Promise<Credentials> {
    return fetch(createOAuthRequestTokenUrl(config))
        .then(async response => {
            if (!response.ok) {
                const errText = await response.text();
                throw Error(`Invalid response received (expected 200, received ${response.status}) when trying to retrieve personal credentials: ${errText}.`);
            }
            return await response.json() as Promise<AccountServiceTokenResponse>
        })
        .then((tokenResponse: AccountServiceTokenResponse) => {
            if (!tokenResponse.access_token || !tokenResponse.expires_in) {
                throw Error(`Invalid response received when trying to retrieve personal credentials - server didn't return a properly formatted token.`);
            }
            return ({
                accessToken: tokenResponse.access_token,
                refreshToken: tokenResponse.refresh_token,
                expiresAt: new Date(Date.now() + (tokenResponse.expires_in * 1000))
            })
        });
}
