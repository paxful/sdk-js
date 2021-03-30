import fetch, { Request } from "node-fetch";

import validateAndRefresh from "./RefreshIfNeeded";

import { Profile, Credentials, CredentialStorage } from "../oauth";
import { ApiConfiguration } from "../ApiConfiguration";

const createRequest = (credentials: Credentials): Request => {
    return new Request({
        href: `${process.env.PAXFUL_OAUTH_HOST}/oauth2/userinfo`
    }, {
        method: "GET",
        headers: {
            "Accepts": "application/json",
            "Authorization": `Bearer ${credentials.accessToken}`
        }
    });
}

/**
 * Retrieves personal access token and refresh token.
 *
 * @param credentialStorage
 * @param config
 */
export default function retrieveProfile(credentialStorage: CredentialStorage, config: ApiConfiguration): Promise<Profile> {
    const token = credentialStorage.getCredentials();
    if(!token) throw Error("Token not provided, please review if token was generated!");
    const request = createRequest(token);
    return fetch(request)
        .then(response => validateAndRefresh(request, response, credentialStorage, config))
        .then(response => response.json() as Promise<Profile>);
}
