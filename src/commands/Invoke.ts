import fetch, { Request, RequestInit, Response } from "node-fetch";

import validateAndRefresh from "./RefreshIfNeeded";
import retrieveImpersonatedCredentials from "./ImpersonateCredentials";

import { Credentials, CredentialStorage } from "../oauth";
import { ApiConfiguration } from "../ApiConfiguration";
import queryString from 'query-string';
import { flatten } from 'q-flat';
import FormData from "form-data";
import { ReadStream } from "fs";

export type AnyJson =  boolean | number | string | null | JsonArray | JsonMap;
export interface JsonMap {  [key: string]: AnyJson; }
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface JsonArray extends Array<AnyJson> {}

export type InvokeBody = Record<string, unknown> | [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyPromise = Promise<any>
export type ResponseParser = (Response) => AnyPromise

const CONTENT_TYPE_HEADER = "Content-Type";

export function containsBinary(payload: InvokeBody) : boolean {
    let isBinary = false;
    Object.values(payload).map(value => {
        if (isBinary) return;
        if (value instanceof Buffer || value instanceof ReadStream) {
            isBinary = true;
        }
    });
    return isBinary
}

export class RequestBuilder {
    private url: string
    private init: RequestInit = {};
    private responseParser: ResponseParser = async (response: Response) => response

    constructor(url: string) {
        this.url = url;
    }

    public withMethod(method: string): RequestBuilder {
        this.init.method = method
        return this
    }

    public withConfig(config: ApiConfiguration): RequestBuilder {
        this.init.agent = config.proxyAgent;
        return this
    }

    public withHeader(header: string, value: string): RequestBuilder {
        this.init.headers = { ...this.init.headers, [header]: value }
        return this
    }

    public withFormData(payload?: InvokeBody): RequestBuilder {
        this.withHeader(CONTENT_TYPE_HEADER, "application/x-www-form-urlencoded")
        this.init.body = queryString.stringify(flatten(payload), { encode: false })
        return this
    }

    public withUrlParams(payload?: InvokeBody): RequestBuilder {
        this.url += "?" + queryString.stringify(flatten(payload), { encode: false })
        return this
    }

    public withMultipartFormData(payload: InvokeBody): RequestBuilder {
        const form: FormData = new FormData();
        Object.keys(payload).forEach((key) => {
            form.append(key, payload[key]);
        })
        this.init.body = form
        return this
    }

    public withJsonData(data?: AnyJson): RequestBuilder {
        this.withHeader(CONTENT_TYPE_HEADER, "application/json")
        this.init.body = JSON.stringify(data || {})
        return this
    }

    public withAuthorization(credentials: Credentials): RequestBuilder {
        this.withHeader("Authorization", `Bearer ${credentials.accessToken}`)
        return this
    }

    public acceptJson(): RequestBuilder {
        this.withHeader("Accept", "application/json");
        this.responseParser = async response => {
            const content = await response.text();
            try {
                return JSON.parse(content);
            } catch (e) {
                throw Error("Can not parse json response: " + content)
            }
        }
        return this
    }

    public acceptText(): RequestBuilder {
        this.responseParser = response => response.text()
        return this
    }

    public acceptBinary(): RequestBuilder {
        this.responseParser = response => {
            return response.buffer()
                .catch(() => (
                    response.arrayBuffer()
                        .catch(() => (
                            response.blob()
                                .catch(() => {
                                    response.text()
                                })
                        ))
                ))
        }
        return this
    }

    public build(): [Request, ResponseParser]  {
        return [new Request(this.url, this.init), this.responseParser]
    }
}

/**
 * Executes request with the user credentials applied.
 * Retrieves personal access token and refresh token.
 *
 * @param requestBuilder
 * @param credentialStorage
 * @param config
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function executeRequestAuthorized(requestBuilder: RequestBuilder, config: ApiConfiguration, credentialStorage?: CredentialStorage): Promise<any> {
    let credentials = credentialStorage?.getCredentials();

    if (!credentials) {
         credentials = await retrieveImpersonatedCredentials(config);
         credentialStorage?.saveCredentials(credentials);
    }

    const [request, transformResponse] = requestBuilder
        .withConfig(config)
        .withAuthorization(credentials)
        .build()

    return fetch(request)
        .then(response => validateAndRefresh(request, response, config, credentialStorage))
        .then(transformResponse);
}
