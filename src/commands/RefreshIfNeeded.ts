import fetch, { Request, Response } from "node-fetch";
import { URLSearchParams } from "url";

import retrieveImpersonatedCredentials from "./ImpersonateCredentials";

import { AccountServiceTokenResponse, Credentials, CredentialStorage } from "../oauth";
import { ApiConfiguration } from "../ApiConfiguration";

const refreshAccessToken = async (credentials: Credentials, config: ApiConfiguration): Promise<Credentials> => {
    const form = new URLSearchParams();
    form.append("grant_type", "refresh_token");
    form.append("refresh_token", credentials.refreshToken);
    form.append("client_id", config.clientId);
    form.append("client_secret", config.clientSecret);

    return await fetch(
        new Request({
            href: `${process.env.PAXFUL_OAUTH_HOST}/oauth2/token`
        }, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accepts": "application/json"
            },
            agent: config.proxyAgent,
            body: form
        })
    ).then(response => response.json() as Promise<AccountServiceTokenResponse>)
        .then((tokenResponse: AccountServiceTokenResponse) => ({
            accessToken: tokenResponse.access_token,
            refreshToken: tokenResponse.refresh_token,
            expiresAt: new Date(Date.now() + (tokenResponse.expires_in * 1000))
        }));
}

const createRequest = async (request: Request, config: ApiConfiguration, credentialStorage: CredentialStorage): Promise<Request> => {
    let credentials: Credentials|undefined;
    credentials = credentialStorage.getCredentials()
    if (!credentials) {
        throw Error("Misconfiguration: no credentials provided")
    }

    if (credentials.refreshToken) {
        credentials = await refreshAccessToken(credentials, config);
    } else {
        credentials = await retrieveImpersonatedCredentials(config);
    }

    credentialStorage.saveCredentials(credentials);

    request.headers["Authorization"] = `Bearer ${credentials.accessToken}`;

    return Promise.resolve(request);
}

const validateIfTokenIsExpired = async (request: Request, response: Response, config: ApiConfiguration, credentialStorage: CredentialStorage): Promise<Response> => {
    if (response.status === 401) return await fetch(await createRequest(request, config, credentialStorage));
    return Promise.resolve(response);
}

export default function validateAndRefresh(request: Request, response: Response, config: ApiConfiguration, credentialStorage: CredentialStorage): Promise<Response> {
    return validateIfTokenIsExpired(request, response, config, credentialStorage);
}
