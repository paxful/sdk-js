import fetch, { Request } from "node-fetch";
import { URLSearchParams } from "url";

import { AccountServiceTokenResponse, Credentials } from "../oauth";
import { ApiConfiguration } from "../ApiConfiguration";
import { handleErrors } from "./ErrorHandling";

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
        .then(handleErrors("retrieve personal credentials"))
        .then((tokenResponse: AccountServiceTokenResponse) => {
            return ({
                accessToken: tokenResponse.access_token,
                refreshToken: tokenResponse.refresh_token,
                expiresAt: new Date(Date.now() + (tokenResponse.expires_in * 1000))
            })
        });
}
