import fetch, { BodyInit, Request } from "node-fetch";
import { ReadStream } from "fs";
import queryString from 'query-string';
import { flatten } from 'q-flat';

import validateAndRefresh from "./RefreshIfNeeded";
import retrieveImpersonatedCredentials from "./ImpersonateCredentials";

import { Credentials, CredentialStorage } from "../oauth";
import { ApiConfiguration } from "../ApiConfiguration";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
const createRequest = (url: string, config: ApiConfiguration, credentials: Credentials, payload?: Record<string, unknown> | [] | ReadStream | Buffer): Request => {
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${credentials.accessToken}`
    };
    let body: BodyInit | undefined;
    if (payload && (payload instanceof ReadStream || payload instanceof Buffer)) {
        headers["Content-Type"] = "multipart/form-data";
        body = payload;
    } else {
        body = queryString.stringify(flatten(payload), { encode:false });
    }
    return new Request({
        href: `${process.env.PAXFUL_DATA_HOST}${url}`
    }, {
        method: "POST",
        headers,
        agent: config.proxyAgent,
        body
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
export default async function invoke(url: string, config: ApiConfiguration, credentialStorage?: CredentialStorage, payload?: Record<string, unknown> | [] | ReadStream | Buffer): Promise<any> {
    const credentials = credentialStorage?.getCredentials() || await retrieveImpersonatedCredentials(config);
    const request = createRequest(url, config, credentials, payload);
    return fetch(request)
        .then(response => validateAndRefresh(request, response, config, credentialStorage))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then(response => response.json() as Promise<any>);
}
