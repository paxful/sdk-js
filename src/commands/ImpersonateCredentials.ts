import fetch, { Request } from "node-fetch";
import { URLSearchParams } from "url";

import { AccountServiceTokenResponse, Credentials } from "../oauth";
import { ApiConfiguration } from "../ApiConfiguration";
import { handleErrors } from "./ErrorHandling";

const createOAuthRequestTokenUrl = (config: ApiConfiguration, code?: string): Request => {
    const form = new URLSearchParams();
    if(code) {
        form.append("grant_type", "authorization_code");
        form.append("code", code);
        form.append("redirect_uri", config.redirectUri || "");
    } else {
        form.append("grant_type", "client_credentials");
    }
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
 * Retrieves access token and refresh token for the user that authorized your application.
 *
 * @param code
 * @param config
 */
export default function retrieveImpersonatedCredentials(config: ApiConfiguration, code?: string): Promise<Credentials> {
    return fetch(createOAuthRequestTokenUrl(config, code))
        .then(handleErrors("retrieve impersonated credentials"))
        .then((tokenResponse: AccountServiceTokenResponse) => {
            return ({
                accessToken: tokenResponse.access_token,
                refreshToken: tokenResponse.refresh_token,
                expiresAt: new Date(Date.now() + (tokenResponse.expires_in * 1000))
            });
        });
}
