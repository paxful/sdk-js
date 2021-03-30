import fetch, { Request } from "node-fetch";
import { URLSearchParams } from "url";

import { AccountServiceTokenResponse, Credentials } from "../oauth";
import { ApiConfiguration } from "../ApiConfiguration";

const createOAuthRequestTokenUrl = (code: string, config: ApiConfiguration): Request => {
    const form = new URLSearchParams();
    form.append("grant_type", "authorization_code");
    form.append("code", code);
    form.append("redirect_uri", config.redirectUri || "");
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
        body: form
    });
}

/**
 * Retrieves access token and refresh token for the user that authorized your application.
 *
 * @param code
 * @param config
 */
export default function retrieveImpersonatedCredentials(code: string, config: ApiConfiguration): Promise<Credentials> {
    return fetch(createOAuthRequestTokenUrl(code, config))
        .then(response => response.json() as Promise<AccountServiceTokenResponse>)
        .then((tokenResponse: AccountServiceTokenResponse) => ({
            accessToken: tokenResponse.access_token,
            refreshToken: tokenResponse.refresh_token,
            expiresAt: new Date(Date.now() + (tokenResponse.expires_in * 1000))
        }));
}
