import fetch, { Request } from "node-fetch";

import validateAndRefresh from "./RefreshIfNeeded";

import { Credentials, CredentialStorage } from "../oauth";
import { ApiConfiguration } from "../ApiConfiguration";

const createRequest = (url: string, credentials: Credentials): Request => {
    return new Request({
        href: `${process.env.PAXFUL_DATA_HOST}${url}`
    }, {
        method: "POST",
        headers: {
            "Accepts": "application/json",
            "Authorization": `Bearer ${credentials.accessToken}`
        }
    });
}

/**
 * Retrieves personal access token and refresh token.
 *
 * @param url
 * @param credentialStorage
 * @param config
 */
export default function invoke(url: string, credentialStorage: CredentialStorage, config: ApiConfiguration): Promise<any> {
    const request = createRequest(url, credentialStorage.getCredentials());
    return fetch(request)
        .then(response => validateAndRefresh(request, response, credentialStorage, config))
        .then(response => response.json() as Promise<any>);
}
