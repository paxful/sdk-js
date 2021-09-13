import fetch, { Request } from "node-fetch";

import validateAndRefresh from "./RefreshIfNeeded";

import { Credentials, CredentialStorage } from "../oauth";
import { ApiConfiguration } from "../ApiConfiguration";
import queryString from 'query-string';
import { flatten } from 'q-flat';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
const createRequest = (url: string, credentials: Credentials, config: ApiConfiguration, payload?: Record<string, unknown> | []): Request => {
    return new Request({
        href: `${process.env.PAXFUL_DATA_HOST}${url}`
    }, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${credentials.accessToken}`
        },
        agent: config.proxyAgent,
        body: queryString.stringify(flatten(payload), { encode:false })
    });
}

/**
 * Retrieves personal access token and refresh token.
 *
 * @param url
 * @param payload
 * @param credentialStorage
 * @param config
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export default function invoke(url: string, credentialStorage: CredentialStorage, config: ApiConfiguration, payload?: Record<string, unknown> | []): Promise<any> {
    const request = createRequest(url, credentialStorage.getCredentials(), config, payload);
    return fetch(request)
        .then(response => validateAndRefresh(request, response, credentialStorage, config))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then(response => response.json() as Promise<any>);
}
