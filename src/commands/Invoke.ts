import fetch, { BodyInit, Request, Response } from "node-fetch";
import { ReadStream } from "fs";
import queryString from "query-string";
import { flatten } from "q-flat";
import FormData from "form-data";

import validateAndRefresh from "./RefreshIfNeeded";
import retrieveImpersonatedCredentials from "./ImpersonateCredentials";

import { Credentials, CredentialStorage } from "../oauth";
import { ApiConfiguration } from "../ApiConfiguration";

export type InvokeBody = Record<string, unknown> | [] | ReadStream | Buffer;

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
const createRequest = (url: string, config: ApiConfiguration, credentials: Credentials, payload?: InvokeBody): Request => {
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${credentials.accessToken}`
    };
    let body: BodyInit | undefined;
    if (url.endsWith('/trade-chat/image/upload') && payload) {
        const form: FormData = new FormData();
        Object.keys(payload).forEach((key) => {
            form.append(key, payload[key]);
        })
        body = form;
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

const convertResponse = (response: Response) => {
    const contentType = response.headers.get("Content-Type");
    if (contentType) {
        if( contentType.startsWith("text/") ) {
            return response.text()
        } else if (contentType.indexOf("json") > 0) {
            return response.json()
        }
    }
    return response.blob()
        .catch(() => (
            response.arrayBuffer()
                .catch(() => (
                    response.buffer()
                ))
        ))
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
export default async function invoke(url: string, config: ApiConfiguration, credentialStorage?: CredentialStorage, payload?: InvokeBody): Promise<any> {
    const credentials = credentialStorage?.getCredentials() || await retrieveImpersonatedCredentials(config);
    const request = createRequest(url, config, credentials, payload);
    return fetch(request)
        .then(response => validateAndRefresh(request, response, config, credentialStorage))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then(convertResponse);
}
