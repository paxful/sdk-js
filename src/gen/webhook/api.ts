import * as url from "url";
import { CredentialStorage } from "../../oauth";
import { ApiConfiguration } from "../../ApiConfiguration";
import { executeRequestAuthorized } from "../../commands";
import { RequestBuilder } from "../../commands/Invoke";
import { Blob, Response } from "node-fetch";

type ModelObject = any;

/**
 * @export
 */
export const COLLECTION_FORMATS = {
    csv: ",",
    ssv: " ",
    tsv: "\t",
    pipes: "|",
};

/**
 * @export
 * @interface FetchArgs
 */
export interface FetchArgs {
    url: string;
    options: any;
}

/**
 * @export
 * @class BaseAPI
 */
export class BaseAPI {
    protected readonly apiConfiguration: ApiConfiguration
    protected readonly credentialStorage: CredentialStorage

    constructor(configuration: ApiConfiguration, credentialStorage: CredentialStorage) {
        this.apiConfiguration = configuration;
        this.credentialStorage = credentialStorage;
    }
}

/**
 * @export
 * @class RequiredError
 * @extends {Error}
 */
export class RequiredError extends Error {
    name = "RequiredError"
    constructor(public field: string, msg?: string) {
        super(msg);
    }
}

/**
 * 
 * @export
 * @interface EndpointIn
 */
export interface EndpointIn {
    /**
     * 
     * @type {string}
     * @memberof EndpointIn
     */
    eventType: string;
    /**
     * 
     * @type {string}
     * @memberof EndpointIn
     */
    url: string;
    /**
     * 
     * @type {boolean}
     * @memberof EndpointIn
     */
    enabled?: boolean;
}
/**
 * 
 * @export
 * @interface EndpointOut
 */
export interface EndpointOut {
    /**
     * 
     * @type {string}
     * @memberof EndpointOut
     */
    eventType: string;
    /**
     * 
     * @type {string}
     * @memberof EndpointOut
     */
    url: string;
    /**
     * 
     * @type {boolean}
     * @memberof EndpointOut
     */
    enabled?: boolean;
    /**
     * 
     * @type {number}
     * @memberof EndpointOut
     */
    id: number;
    /**
     * 
     * @type {Date}
     * @memberof EndpointOut
     */
    lastActivity?: Date;
    /**
     * 
     * @type {string}
     * @memberof EndpointOut
     */
    errorCode?: string;
}
/**
 * 
 * @export
 * @interface HTTPValidationError
 */
export interface HTTPValidationError {
    /**
     * 
     * @type {Array<ValidationError>}
     * @memberof HTTPValidationError
     */
    detail?: Array<ValidationError>;
}
/**
 * 
 * @export
 * @interface LogRecordOut
 */
export interface LogRecordOut {
    /**
     * 
     * @type {number}
     * @memberof LogRecordOut
     */
    id: number;
    /**
     * 
     * @type {Date}
     * @memberof LogRecordOut
     */
    sentAt: Date;
    /**
     * 
     * @type {string}
     * @memberof LogRecordOut
     */
    url: string;
    /**
     * 
     * @type {string}
     * @memberof LogRecordOut
     */
    method: string;
    /**
     * 
     * @type {string}
     * @memberof LogRecordOut
     */
    requestBody?: string;
    /**
     * 
     * @type {string}
     * @memberof LogRecordOut
     */
    requestHeaders?: string;
    /**
     * 
     * @type {number}
     * @memberof LogRecordOut
     */
    requestTryNo: number;
    /**
     * 
     * @type {number}
     * @memberof LogRecordOut
     */
    responseStatus: number;
    /**
     * 
     * @type {string}
     * @memberof LogRecordOut
     */
    responseHeaders?: string;
    /**
     * 
     * @type {string}
     * @memberof LogRecordOut
     */
    responseBody?: string;
    /**
     * 
     * @type {boolean}
     * @memberof LogRecordOut
     */
    success: boolean;
    /**
     * 
     * @type {string}
     * @memberof LogRecordOut
     */
    errorCode?: string;
    /**
     * 
     * @type {string}
     * @memberof LogRecordOut
     */
    errorDescription?: string;
}
/**
 * 
 * @export
 * @interface UserWebhookOut
 */
export interface UserWebhookOut {
    /**
     * 
     * @type {string}
     * @memberof UserWebhookOut
     */
    applicationId?: string;
    /**
     * 
     * @type {string}
     * @memberof UserWebhookOut
     */
    developerId?: string;
    /**
     * 
     * @type {string}
     * @memberof UserWebhookOut
     */
    userId?: string;
    /**
     * 
     * @type {string}
     * @memberof UserWebhookOut
     */
    webhookId: string;
    /**
     * 
     * @type {string}
     * @memberof UserWebhookOut
     */
    tag?: string;
    /**
     * 
     * @type {Array<EndpointOut>}
     * @memberof UserWebhookOut
     */
    endpoints: Array<EndpointOut>;
    /**
     * 
     * @type {LogRecordOut}
     * @memberof UserWebhookOut
     */
    lastRequest?: LogRecordOut;
}
/**
 * 
 * @export
 * @interface ValidationError
 */
export interface ValidationError {
    /**
     * 
     * @type {Array<string>}
     * @memberof ValidationError
     */
    loc: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof ValidationError
     */
    msg: string;
    /**
     * 
     * @type {string}
     * @memberof ValidationError
     */
    type: string;
}
/**
 * 
 * @export
 * @interface WebhookIn
 */
export interface WebhookIn {
    /**
     * 
     * @type {string}
     * @memberof WebhookIn
     */
    tag?: string;
    /**
     * 
     * @type {Array<EndpointIn>}
     * @memberof WebhookIn
     */
    endpoints: Array<EndpointIn>;
}
/**
 * 
 * @export
 * @interface WebhookOut
 */
export interface WebhookOut {
    /**
     * 
     * @type {string}
     * @memberof WebhookOut
     */
    applicationId?: string;
    /**
     * 
     * @type {string}
     * @memberof WebhookOut
     */
    developerId?: string;
    /**
     * 
     * @type {string}
     * @memberof WebhookOut
     */
    userId?: string;
    /**
     * 
     * @type {string}
     * @memberof WebhookOut
     */
    webhookId: string;
    /**
     * 
     * @type {string}
     * @memberof WebhookOut
     */
    tag?: string;
    /**
     * 
     * @type {Array<EndpointOut>}
     * @memberof WebhookOut
     */
    endpoints: Array<EndpointOut>;
}
/**
 * DefaultApi - fetch parameter creator
 * @export
 */
export const DefaultApiFetchParamCreator = {
    /**
     * 
     * @summary Add user personal webhook
     * @param {WebhookIn} body 
     * @param {string} userId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    addUserInternalWebhook(body?: WebhookIn, userId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'body' is not null or undefined
        if (body === null || body === undefined) {
            throw new RequiredError('body','Required parameter body was null or undefined when calling addUserInternalWebhook.');
        }
        // verify required parameter 'userId' is not null or undefined
        if (userId === null || userId === undefined) {
            throw new RequiredError('userId','Required parameter userId was null or undefined when calling addUserInternalWebhook.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/internal-api/v1/user/{user_id}/webhooks`
            .replace(`{${"user_id"}}`, encodeURIComponent(String(userId)));
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarHeaderParameter['Content-Type'] = 'application/json';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        const needsSerialization = (<any>"WebhookIn" !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
        localVarRequestOptions.body =  needsSerialization ? JSON.stringify(body || {}) : (body || "");

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * 
     * @summary Get webhook endpoint details
     * @param {EndpointIn} body 
     * @param {string} webhookId 
     * @param {string} userId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    addWebhookEndpoint(body?: EndpointIn, webhookId?: string, userId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'body' is not null or undefined
        if (body === null || body === undefined) {
            throw new RequiredError('body','Required parameter body was null or undefined when calling addWebhookEndpoint.');
        }
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling addWebhookEndpoint.');
        }
        // verify required parameter 'userId' is not null or undefined
        if (userId === null || userId === undefined) {
            throw new RequiredError('userId','Required parameter userId was null or undefined when calling addWebhookEndpoint.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/internal-api/v1/user/{user_id}/webhooks/{webhook_id}/endpoints/`
            .replace(`{${"webhook_id"}}`, encodeURIComponent(String(webhookId)))
            .replace(`{${"user_id"}}`, encodeURIComponent(String(userId)));
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarHeaderParameter['Content-Type'] = 'application/json';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        const needsSerialization = (<any>"EndpointIn" !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
        localVarRequestOptions.body =  needsSerialization ? JSON.stringify(body || {}) : (body || "");

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * 
     * @summary Remove user personal webhook by id
     * @param {string} userId 
     * @param {string} webhookId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    deleteUserInternalWebhooks(userId?: string, webhookId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'userId' is not null or undefined
        if (userId === null || userId === undefined) {
            throw new RequiredError('userId','Required parameter userId was null or undefined when calling deleteUserInternalWebhooks.');
        }
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling deleteUserInternalWebhooks.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/internal-api/v1/user/{user_id}/webhooks/{webhook_id}`
            .replace(`{${"user_id"}}`, encodeURIComponent(String(userId)))
            .replace(`{${"webhook_id"}}`, encodeURIComponent(String(webhookId)));
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'DELETE' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * 
     * @summary Get webhook endpoint details
     * @param {string} webhookId 
     * @param {number} endpointId 
     * @param {string} userId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    deleteWebhookEndpointById(webhookId?: string, endpointId?: number, userId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling deleteWebhookEndpointById.');
        }
        // verify required parameter 'endpointId' is not null or undefined
        if (endpointId === null || endpointId === undefined) {
            throw new RequiredError('endpointId','Required parameter endpointId was null or undefined when calling deleteWebhookEndpointById.');
        }
        // verify required parameter 'userId' is not null or undefined
        if (userId === null || userId === undefined) {
            throw new RequiredError('userId','Required parameter userId was null or undefined when calling deleteWebhookEndpointById.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/internal-api/v1/user/{user_id}/webhooks/{webhook_id}/endpoints/{endpoint_id}`
            .replace(`{${"webhook_id"}}`, encodeURIComponent(String(webhookId)))
            .replace(`{${"endpoint_id"}}`, encodeURIComponent(String(endpointId)))
            .replace(`{${"user_id"}}`, encodeURIComponent(String(userId)));
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'DELETE' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * 
     * @summary Get webhook details
     * @param {string} userId 
     * @param {string} webhookId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getUserInternalWebhookDetails(userId?: string, webhookId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'userId' is not null or undefined
        if (userId === null || userId === undefined) {
            throw new RequiredError('userId','Required parameter userId was null or undefined when calling getUserInternalWebhookDetails.');
        }
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling getUserInternalWebhookDetails.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/internal-api/v1/user/{user_id}/webhooks/{webhook_id}`
            .replace(`{${"user_id"}}`, encodeURIComponent(String(userId)))
            .replace(`{${"webhook_id"}}`, encodeURIComponent(String(webhookId)));
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * 
     * @summary Get webhook endpoint details
     * @param {string} webhookId 
     * @param {number} endpointId 
     * @param {string} userId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getWebhookEndpointById(webhookId?: string, endpointId?: number, userId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling getWebhookEndpointById.');
        }
        // verify required parameter 'endpointId' is not null or undefined
        if (endpointId === null || endpointId === undefined) {
            throw new RequiredError('endpointId','Required parameter endpointId was null or undefined when calling getWebhookEndpointById.');
        }
        // verify required parameter 'userId' is not null or undefined
        if (userId === null || userId === undefined) {
            throw new RequiredError('userId','Required parameter userId was null or undefined when calling getWebhookEndpointById.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/internal-api/v1/user/{user_id}/webhooks/{webhook_id}/endpoints/{endpoint_id}`
            .replace(`{${"webhook_id"}}`, encodeURIComponent(String(webhookId)))
            .replace(`{${"endpoint_id"}}`, encodeURIComponent(String(endpointId)))
            .replace(`{${"user_id"}}`, encodeURIComponent(String(userId)));
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * 
     * @summary Get webhook endpoint list
     * @param {string} webhookId 
     * @param {string} userId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getWebhookEndpoints(webhookId?: string, userId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling getWebhookEndpoints.');
        }
        // verify required parameter 'userId' is not null or undefined
        if (userId === null || userId === undefined) {
            throw new RequiredError('userId','Required parameter userId was null or undefined when calling getWebhookEndpoints.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/internal-api/v1/user/{user_id}/webhooks/{webhook_id}/endpoints/`
            .replace(`{${"webhook_id"}}`, encodeURIComponent(String(webhookId)))
            .replace(`{${"user_id"}}`, encodeURIComponent(String(userId)));
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * 
     * @summary Update webhook endpoint details
     * @param {EndpointIn} body 
     * @param {string} webhookId 
     * @param {number} endpointId 
     * @param {string} userId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    updateWebhookEndpointById(body?: EndpointIn, webhookId?: string, endpointId?: number, userId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'body' is not null or undefined
        if (body === null || body === undefined) {
            throw new RequiredError('body','Required parameter body was null or undefined when calling updateWebhookEndpointById.');
        }
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling updateWebhookEndpointById.');
        }
        // verify required parameter 'endpointId' is not null or undefined
        if (endpointId === null || endpointId === undefined) {
            throw new RequiredError('endpointId','Required parameter endpointId was null or undefined when calling updateWebhookEndpointById.');
        }
        // verify required parameter 'userId' is not null or undefined
        if (userId === null || userId === undefined) {
            throw new RequiredError('userId','Required parameter userId was null or undefined when calling updateWebhookEndpointById.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/internal-api/v1/user/{user_id}/webhooks/{webhook_id}/endpoints/{endpoint_id}`
            .replace(`{${"webhook_id"}}`, encodeURIComponent(String(webhookId)))
            .replace(`{${"endpoint_id"}}`, encodeURIComponent(String(endpointId)))
            .replace(`{${"user_id"}}`, encodeURIComponent(String(userId)));
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'PUT' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarHeaderParameter['Content-Type'] = 'application/json';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        const needsSerialization = (<any>"EndpointIn" !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
        localVarRequestOptions.body =  needsSerialization ? JSON.stringify(body || {}) : (body || "");

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
};

export type DefaultApiAddUserInternalWebhookParams = {
    /**
     * 
     */
    body: WebhookIn;

    /**
     * 
     */
    userId: string;

}

export type DefaultApiAddWebhookEndpointParams = {
    /**
     * 
     */
    body: EndpointIn;

    /**
     * 
     */
    webhookId: string;

    /**
     * 
     */
    userId: string;

}

export type DefaultApiDeleteUserInternalWebhooksParams = {
    /**
     * 
     */
    userId: string;

    /**
     * 
     */
    webhookId: string;

}

export type DefaultApiDeleteWebhookEndpointByIdParams = {
    /**
     * 
     */
    webhookId: string;

    /**
     * 
     */
    endpointId: number;

    /**
     * 
     */
    userId: string;

}

export type DefaultApiGetUserInternalWebhookDetailsParams = {
    /**
     * 
     */
    userId: string;

    /**
     * 
     */
    webhookId: string;

}

export type DefaultApiGetWebhookEndpointByIdParams = {
    /**
     * 
     */
    webhookId: string;

    /**
     * 
     */
    endpointId: number;

    /**
     * 
     */
    userId: string;

}

export type DefaultApiGetWebhookEndpointsParams = {
    /**
     * 
     */
    webhookId: string;

    /**
     * 
     */
    userId: string;

}

export type DefaultApiUpdateWebhookEndpointByIdParams = {
    /**
     * 
     */
    body: EndpointIn;

    /**
     * 
     */
    webhookId: string;

    /**
     * 
     */
    endpointId: number;

    /**
     * 
     */
    userId: string;

}


/**
 * DefaultApi
 *
 * @export
 * @class DefaultApi
 * @extends {BaseAPI}
 */
export class DefaultApi extends BaseAPI {
    /**
     * 
     *
     * @summary Add user personal webhook
     * @param { DefaultApiAddUserInternalWebhookParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public addUserInternalWebhook(params: DefaultApiAddUserInternalWebhookParams, options?: any): Promise<UserWebhookOut> {
        const localVarFetchArgs = DefaultApiFetchParamCreator.addUserInternalWebhook(params?.body, params?.userId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * 
     *
     * @summary Get webhook endpoint details
     * @param { DefaultApiAddWebhookEndpointParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public addWebhookEndpoint(params: DefaultApiAddWebhookEndpointParams, options?: any): Promise<Array<EndpointOut>> {
        const localVarFetchArgs = DefaultApiFetchParamCreator.addWebhookEndpoint(params?.body, params?.webhookId, params?.userId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * 
     *
     * @summary Remove user personal webhook by id
     * @param { DefaultApiDeleteUserInternalWebhooksParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public deleteUserInternalWebhooks(params: DefaultApiDeleteUserInternalWebhooksParams, options?: any): Promise<ModelObject> {
        const localVarFetchArgs = DefaultApiFetchParamCreator.deleteUserInternalWebhooks(params?.userId, params?.webhookId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * 
     *
     * @summary Get webhook endpoint details
     * @param { DefaultApiDeleteWebhookEndpointByIdParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public deleteWebhookEndpointById(params: DefaultApiDeleteWebhookEndpointByIdParams, options?: any): Promise<ModelObject> {
        const localVarFetchArgs = DefaultApiFetchParamCreator.deleteWebhookEndpointById(params?.webhookId, params?.endpointId, params?.userId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * 
     *
     * @summary Get webhook details
     * @param { DefaultApiGetUserInternalWebhookDetailsParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public getUserInternalWebhookDetails(params: DefaultApiGetUserInternalWebhookDetailsParams, options?: any): Promise<UserWebhookOut> {
        const localVarFetchArgs = DefaultApiFetchParamCreator.getUserInternalWebhookDetails(params?.userId, params?.webhookId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * 
     *
     * @summary Get webhook endpoint details
     * @param { DefaultApiGetWebhookEndpointByIdParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public getWebhookEndpointById(params: DefaultApiGetWebhookEndpointByIdParams, options?: any): Promise<EndpointOut> {
        const localVarFetchArgs = DefaultApiFetchParamCreator.getWebhookEndpointById(params?.webhookId, params?.endpointId, params?.userId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * 
     *
     * @summary Get webhook endpoint list
     * @param { DefaultApiGetWebhookEndpointsParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public getWebhookEndpoints(params: DefaultApiGetWebhookEndpointsParams, options?: any): Promise<Array<EndpointOut>> {
        const localVarFetchArgs = DefaultApiFetchParamCreator.getWebhookEndpoints(params?.webhookId, params?.userId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * 
     *
     * @summary Update webhook endpoint details
     * @param { DefaultApiUpdateWebhookEndpointByIdParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public updateWebhookEndpointById(params: DefaultApiUpdateWebhookEndpointByIdParams, options?: any): Promise<EndpointOut> {
        const localVarFetchArgs = DefaultApiFetchParamCreator.updateWebhookEndpointById(params?.body, params?.webhookId, params?.endpointId, params?.userId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

}
/**
 * DeveloperApi - fetch parameter creator
 * @export
 */
export const DeveloperApiFetchParamCreator = {
    /**
     * 
     * @summary Get webhook http request log
     * @param {string} applicationId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getLogs(applicationId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'applicationId' is not null or undefined
        if (applicationId === null || applicationId === undefined) {
            throw new RequiredError('applicationId','Required parameter applicationId was null or undefined when calling getLogs.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/api/v1/applications/{application_id}/log`
            .replace(`{${"application_id"}}`, encodeURIComponent(String(applicationId)));
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Key may be used to validate webhook signature
     * @summary Get public key
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getSignaturePublicKey(options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/public/.well-known/public.key`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Endpoint can be safely called many times. If configuration does not exist it will be created. If does exist, updated.
     * @summary Create webhook configuration for application
     * @param {WebhookIn} body 
     * @param {string} applicationId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    webhookCreate(body?: WebhookIn, applicationId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'body' is not null or undefined
        if (body === null || body === undefined) {
            throw new RequiredError('body','Required parameter body was null or undefined when calling webhookCreate.');
        }
        // verify required parameter 'applicationId' is not null or undefined
        if (applicationId === null || applicationId === undefined) {
            throw new RequiredError('applicationId','Required parameter applicationId was null or undefined when calling webhookCreate.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/api/v1/applications/{application_id}/webhooks`
            .replace(`{${"application_id"}}`, encodeURIComponent(String(applicationId)));
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarHeaderParameter['Content-Type'] = 'application/json';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        const needsSerialization = (<any>"WebhookIn" !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
        localVarRequestOptions.body =  needsSerialization ? JSON.stringify(body || {}) : (body || "");

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Also removes user-specific webhooks associated with the application_id
     * @summary Remove webhook configuration for application
     * @param {string} applicationId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    webhookDelete(applicationId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'applicationId' is not null or undefined
        if (applicationId === null || applicationId === undefined) {
            throw new RequiredError('applicationId','Required parameter applicationId was null or undefined when calling webhookDelete.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/api/v1/applications/{application_id}`
            .replace(`{${"application_id"}}`, encodeURIComponent(String(applicationId)));
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'DELETE' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * 
     * @summary Get application webhook configuration
     * @param {string} applicationId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    webhookGet(applicationId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'applicationId' is not null or undefined
        if (applicationId === null || applicationId === undefined) {
            throw new RequiredError('applicationId','Required parameter applicationId was null or undefined when calling webhookGet.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/api/v1/applications/{application_id}/webhooks`
            .replace(`{${"application_id"}}`, encodeURIComponent(String(applicationId)));
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * 
     * @summary Update webhook configuration for application
     * @param {WebhookIn} body 
     * @param {string} applicationId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    webhookUpdate(body?: WebhookIn, applicationId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'body' is not null or undefined
        if (body === null || body === undefined) {
            throw new RequiredError('body','Required parameter body was null or undefined when calling webhookUpdate.');
        }
        // verify required parameter 'applicationId' is not null or undefined
        if (applicationId === null || applicationId === undefined) {
            throw new RequiredError('applicationId','Required parameter applicationId was null or undefined when calling webhookUpdate.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/api/v1/applications/{application_id}/webhooks`
            .replace(`{${"application_id"}}`, encodeURIComponent(String(applicationId)));
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'PUT' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarHeaderParameter['Content-Type'] = 'application/json';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        const needsSerialization = (<any>"WebhookIn" !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
        localVarRequestOptions.body =  needsSerialization ? JSON.stringify(body || {}) : (body || "");

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
};

export type DeveloperApiGetLogsParams = {
    /**
     * 
     */
    applicationId: string;

}

export type DeveloperApiGetSignaturePublicKeyParams = {
}

export type DeveloperApiWebhookCreateParams = {
    /**
     * 
     */
    body: WebhookIn;

    /**
     * 
     */
    applicationId: string;

}

export type DeveloperApiWebhookDeleteParams = {
    /**
     * 
     */
    applicationId: string;

}

export type DeveloperApiWebhookGetParams = {
    /**
     * 
     */
    applicationId: string;

}

export type DeveloperApiWebhookUpdateParams = {
    /**
     * 
     */
    body: WebhookIn;

    /**
     * 
     */
    applicationId: string;

}


/**
 * DeveloperApi
 *
 * @export
 * @class DeveloperApi
 * @extends {BaseAPI}
 */
export class DeveloperApi extends BaseAPI {
    /**
     * 
     *
     * @summary Get webhook http request log
     * @param { DeveloperApiGetLogsParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeveloperApi
     */
    public getLogs(params: DeveloperApiGetLogsParams, options?: any): Promise<Array<LogRecordOut>> {
        const localVarFetchArgs = DeveloperApiFetchParamCreator.getLogs(params?.applicationId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Key may be used to validate webhook signature
     *
     * @summary Get public key
     * @param { DeveloperApiGetSignaturePublicKeyParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeveloperApi
     */
    public getSignaturePublicKey(options?: any): Promise<ModelObject> {
        const localVarFetchArgs = DeveloperApiFetchParamCreator.getSignaturePublicKey(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Endpoint can be safely called many times. If configuration does not exist it will be created. If does exist, updated.
     *
     * @summary Create webhook configuration for application
     * @param { DeveloperApiWebhookCreateParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeveloperApi
     */
    public webhookCreate(params: DeveloperApiWebhookCreateParams, options?: any): Promise<ModelObject> {
        const localVarFetchArgs = DeveloperApiFetchParamCreator.webhookCreate(params?.body, params?.applicationId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Also removes user-specific webhooks associated with the application_id
     *
     * @summary Remove webhook configuration for application
     * @param { DeveloperApiWebhookDeleteParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeveloperApi
     */
    public webhookDelete(params: DeveloperApiWebhookDeleteParams, options?: any): Promise<ModelObject> {
        const localVarFetchArgs = DeveloperApiFetchParamCreator.webhookDelete(params?.applicationId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * 
     *
     * @summary Get application webhook configuration
     * @param { DeveloperApiWebhookGetParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeveloperApi
     */
    public webhookGet(params: DeveloperApiWebhookGetParams, options?: any): Promise<WebhookOut> {
        const localVarFetchArgs = DeveloperApiFetchParamCreator.webhookGet(params?.applicationId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * 
     *
     * @summary Update webhook configuration for application
     * @param { DeveloperApiWebhookUpdateParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeveloperApi
     */
    public webhookUpdate(params: DeveloperApiWebhookUpdateParams, options?: any): Promise<ModelObject> {
        const localVarFetchArgs = DeveloperApiFetchParamCreator.webhookUpdate(params?.body, params?.applicationId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

}
/**
 * UserApi - fetch parameter creator
 * @export
 */
export const UserApiFetchParamCreator = {
    /**
     * 
     * @summary Register user-specific webhooks
     * @param {WebhookIn} body 
     * @param {string} applicationId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    addUserSpecificWebhooks(body?: WebhookIn, applicationId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'body' is not null or undefined
        if (body === null || body === undefined) {
            throw new RequiredError('body','Required parameter body was null or undefined when calling addUserSpecificWebhooks.');
        }
        // verify required parameter 'applicationId' is not null or undefined
        if (applicationId === null || applicationId === undefined) {
            throw new RequiredError('applicationId','Required parameter applicationId was null or undefined when calling addUserSpecificWebhooks.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/api/v1/applications/{application_id}/user/webhooks`
            .replace(`{${"application_id"}}`, encodeURIComponent(String(applicationId)));
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarHeaderParameter['Content-Type'] = 'application/json';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        const needsSerialization = (<any>"WebhookIn" !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
        localVarRequestOptions.body =  needsSerialization ? JSON.stringify(body || {}) : (body || "");

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * 
     * @summary Add user personal webhook
     * @param {WebhookIn} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    addUserWebhook(body?: WebhookIn, options: any = {}): FetchArgs {
        // verify required parameter 'body' is not null or undefined
        if (body === null || body === undefined) {
            throw new RequiredError('body','Required parameter body was null or undefined when calling addUserWebhook.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/api/v1/user/webhooks`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarHeaderParameter['Content-Type'] = 'application/json';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        const needsSerialization = (<any>"WebhookIn" !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
        localVarRequestOptions.body =  needsSerialization ? JSON.stringify(body || {}) : (body || "");

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * 
     * @summary Get webhook endpoint details
     * @param {EndpointIn} body 
     * @param {string} webhookId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    addWebhookEndpoint(body?: EndpointIn, webhookId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'body' is not null or undefined
        if (body === null || body === undefined) {
            throw new RequiredError('body','Required parameter body was null or undefined when calling addWebhookEndpoint.');
        }
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling addWebhookEndpoint.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/api/v1/user/webhooks/{webhook_id}/endpoints/`
            .replace(`{${"webhook_id"}}`, encodeURIComponent(String(webhookId)));
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarHeaderParameter['Content-Type'] = 'application/json';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        const needsSerialization = (<any>"EndpointIn" !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
        localVarRequestOptions.body =  needsSerialization ? JSON.stringify(body || {}) : (body || "");

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * 
     * @summary Remove all user personal webhooks
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    deleteAllUserWebhooks(options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/api/v1/user/webhooks`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'DELETE' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * 
     * @summary Remove user personal webhook by id
     * @param {string} tag 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    deleteAllUserWebhooksByTag(tag?: string, options: any = {}): FetchArgs {
        // verify required parameter 'tag' is not null or undefined
        if (tag === null || tag === undefined) {
            throw new RequiredError('tag','Required parameter tag was null or undefined when calling deleteAllUserWebhooksByTag.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/api/v1/user/webhooks/tag/{tag}`
            .replace(`{${"tag"}}`, encodeURIComponent(String(tag)));
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'DELETE' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * 
     * @summary Remove user personal webhook by id
     * @param {string} webhookId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    deleteUserWebhooks(webhookId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling deleteUserWebhooks.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/api/v1/user/webhooks/{webhook_id}`
            .replace(`{${"webhook_id"}}`, encodeURIComponent(String(webhookId)));
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'DELETE' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * 
     * @summary Get webhook endpoint details
     * @param {string} webhookId 
     * @param {number} endpointId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    deleteWebhookEndpointById(webhookId?: string, endpointId?: number, options: any = {}): FetchArgs {
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling deleteWebhookEndpointById.');
        }
        // verify required parameter 'endpointId' is not null or undefined
        if (endpointId === null || endpointId === undefined) {
            throw new RequiredError('endpointId','Required parameter endpointId was null or undefined when calling deleteWebhookEndpointById.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/api/v1/user/webhooks/{webhook_id}/endpoints/{endpoint_id}`
            .replace(`{${"webhook_id"}}`, encodeURIComponent(String(webhookId)))
            .replace(`{${"endpoint_id"}}`, encodeURIComponent(String(endpointId)));
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'DELETE' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * 
     * @summary Get webhook details
     * @param {string} webhookId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getUserWebhookDetails(webhookId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling getUserWebhookDetails.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/api/v1/user/webhooks/{webhook_id}`
            .replace(`{${"webhook_id"}}`, encodeURIComponent(String(webhookId)));
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * 
     * @summary Get list of user personal webhooks
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getUserWebhooksPublic(options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/api/v1/user/webhooks`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * 
     * @summary Get user webhooks by tag
     * @param {string} tag 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getUserWebhooksPublicByTag(tag?: string, options: any = {}): FetchArgs {
        // verify required parameter 'tag' is not null or undefined
        if (tag === null || tag === undefined) {
            throw new RequiredError('tag','Required parameter tag was null or undefined when calling getUserWebhooksPublicByTag.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/api/v1/user/webhooks/tag/{tag}`
            .replace(`{${"tag"}}`, encodeURIComponent(String(tag)));
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * 
     * @summary Get webhook endpoint details
     * @param {string} webhookId 
     * @param {number} endpointId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getWebhookEndpointById(webhookId?: string, endpointId?: number, options: any = {}): FetchArgs {
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling getWebhookEndpointById.');
        }
        // verify required parameter 'endpointId' is not null or undefined
        if (endpointId === null || endpointId === undefined) {
            throw new RequiredError('endpointId','Required parameter endpointId was null or undefined when calling getWebhookEndpointById.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/api/v1/user/webhooks/{webhook_id}/endpoints/{endpoint_id}`
            .replace(`{${"webhook_id"}}`, encodeURIComponent(String(webhookId)))
            .replace(`{${"endpoint_id"}}`, encodeURIComponent(String(endpointId)));
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * 
     * @summary Get webhook endpoint list
     * @param {string} webhookId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getWebhookEndpoints(webhookId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling getWebhookEndpoints.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/api/v1/user/webhooks/{webhook_id}/endpoints/`
            .replace(`{${"webhook_id"}}`, encodeURIComponent(String(webhookId)));
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * 
     * @summary Update webhook endpoint details
     * @param {EndpointIn} body 
     * @param {string} webhookId 
     * @param {number} endpointId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    updateWebhookEndpointById(body?: EndpointIn, webhookId?: string, endpointId?: number, options: any = {}): FetchArgs {
        // verify required parameter 'body' is not null or undefined
        if (body === null || body === undefined) {
            throw new RequiredError('body','Required parameter body was null or undefined when calling updateWebhookEndpointById.');
        }
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling updateWebhookEndpointById.');
        }
        // verify required parameter 'endpointId' is not null or undefined
        if (endpointId === null || endpointId === undefined) {
            throw new RequiredError('endpointId','Required parameter endpointId was null or undefined when calling updateWebhookEndpointById.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/api/v1/user/webhooks/{webhook_id}/endpoints/{endpoint_id}`
            .replace(`{${"webhook_id"}}`, encodeURIComponent(String(webhookId)))
            .replace(`{${"endpoint_id"}}`, encodeURIComponent(String(endpointId)));
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'PUT' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarHeaderParameter['Content-Type'] = 'application/json';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        const needsSerialization = (<any>"EndpointIn" !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
        localVarRequestOptions.body =  needsSerialization ? JSON.stringify(body || {}) : (body || "");

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Webhooks must be preconfigured using POST /applications/{application_id}/webhooks
     * @summary Subscribe current user to application's webhooks
     * @param {string} applicationId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    subscribe(applicationId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'applicationId' is not null or undefined
        if (applicationId === null || applicationId === undefined) {
            throw new RequiredError('applicationId','Required parameter applicationId was null or undefined when calling subscribe.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/api/v1/applications/{application_id}/subscribe`
            .replace(`{${"application_id"}}`, encodeURIComponent(String(applicationId)));
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * 
     * @summary Unsubscribe current user from application's webhooks
     * @param {string} applicationId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    unsubscribe(applicationId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'applicationId' is not null or undefined
        if (applicationId === null || applicationId === undefined) {
            throw new RequiredError('applicationId','Required parameter applicationId was null or undefined when calling unsubscribe.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/api/v1/applications/{application_id}/unsubscribe`
            .replace(`{${"application_id"}}`, encodeURIComponent(String(applicationId)));
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'DELETE' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
};

export type UserApiAddUserSpecificWebhooksParams = {
    /**
     * 
     */
    body: WebhookIn;

    /**
     * 
     */
    applicationId: string;

}

export type UserApiAddUserWebhookParams = {
    /**
     * 
     */
    body: WebhookIn;

}

export type UserApiAddWebhookEndpointParams = {
    /**
     * 
     */
    body: EndpointIn;

    /**
     * 
     */
    webhookId: string;

}

export type UserApiDeleteAllUserWebhooksParams = {
}

export type UserApiDeleteAllUserWebhooksByTagParams = {
    /**
     * 
     */
    tag: string;

}

export type UserApiDeleteUserWebhooksParams = {
    /**
     * 
     */
    webhookId: string;

}

export type UserApiDeleteWebhookEndpointByIdParams = {
    /**
     * 
     */
    webhookId: string;

    /**
     * 
     */
    endpointId: number;

}

export type UserApiGetUserWebhookDetailsParams = {
    /**
     * 
     */
    webhookId: string;

}

export type UserApiGetUserWebhooksPublicParams = {
}

export type UserApiGetUserWebhooksPublicByTagParams = {
    /**
     * 
     */
    tag: string;

}

export type UserApiGetWebhookEndpointByIdParams = {
    /**
     * 
     */
    webhookId: string;

    /**
     * 
     */
    endpointId: number;

}

export type UserApiGetWebhookEndpointsParams = {
    /**
     * 
     */
    webhookId: string;

}

export type UserApiUpdateWebhookEndpointByIdParams = {
    /**
     * 
     */
    body: EndpointIn;

    /**
     * 
     */
    webhookId: string;

    /**
     * 
     */
    endpointId: number;

}

export type UserApiUserSubscribeParams = {
    /**
     * 
     */
    applicationId: string;

}

export type UserApiUserUnsubscribeParams = {
    /**
     * 
     */
    applicationId: string;

}


/**
 * UserApi
 *
 * @export
 * @class UserApi
 * @extends {BaseAPI}
 */
export class UserApi extends BaseAPI {
    /**
     * 
     *
     * @summary Register user-specific webhooks
     * @param { UserApiAddUserSpecificWebhooksParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public addUserSpecificWebhooks(params: UserApiAddUserSpecificWebhooksParams, options?: any): Promise<ModelObject> {
        const localVarFetchArgs = UserApiFetchParamCreator.addUserSpecificWebhooks(params?.body, params?.applicationId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * 
     *
     * @summary Add user personal webhook
     * @param { UserApiAddUserWebhookParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public addUserWebhook(params?: UserApiAddUserWebhookParams, options?: any): Promise<UserWebhookOut> {
        const localVarFetchArgs = UserApiFetchParamCreator.addUserWebhook(params?.body, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * 
     *
     * @summary Get webhook endpoint details
     * @param { UserApiAddWebhookEndpointParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public addWebhookEndpoint(params: UserApiAddWebhookEndpointParams, options?: any): Promise<Array<EndpointOut>> {
        const localVarFetchArgs = UserApiFetchParamCreator.addWebhookEndpoint(params?.body, params?.webhookId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * 
     *
     * @summary Remove all user personal webhooks
     * @param { UserApiDeleteAllUserWebhooksParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public deleteAllUserWebhooks(options?: any): Promise<ModelObject> {
        const localVarFetchArgs = UserApiFetchParamCreator.deleteAllUserWebhooks(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * 
     *
     * @summary Remove user personal webhook by id
     * @param { UserApiDeleteAllUserWebhooksByTagParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public deleteAllUserWebhooksByTag(params: UserApiDeleteAllUserWebhooksByTagParams, options?: any): Promise<ModelObject> {
        const localVarFetchArgs = UserApiFetchParamCreator.deleteAllUserWebhooksByTag(params?.tag, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * 
     *
     * @summary Remove user personal webhook by id
     * @param { UserApiDeleteUserWebhooksParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public deleteUserWebhooks(params: UserApiDeleteUserWebhooksParams, options?: any): Promise<ModelObject> {
        const localVarFetchArgs = UserApiFetchParamCreator.deleteUserWebhooks(params?.webhookId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * 
     *
     * @summary Get webhook endpoint details
     * @param { UserApiDeleteWebhookEndpointByIdParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public deleteWebhookEndpointById(params: UserApiDeleteWebhookEndpointByIdParams, options?: any): Promise<ModelObject> {
        const localVarFetchArgs = UserApiFetchParamCreator.deleteWebhookEndpointById(params?.webhookId, params?.endpointId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * 
     *
     * @summary Get webhook details
     * @param { UserApiGetUserWebhookDetailsParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public getUserWebhookDetails(params: UserApiGetUserWebhookDetailsParams, options?: any): Promise<UserWebhookOut> {
        const localVarFetchArgs = UserApiFetchParamCreator.getUserWebhookDetails(params?.webhookId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * 
     *
     * @summary Get list of user personal webhooks
     * @param { UserApiGetUserWebhooksPublicParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public getUserWebhooksPublic(options?: any): Promise<Array<UserWebhookOut>> {
        const localVarFetchArgs = UserApiFetchParamCreator.getUserWebhooksPublic(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * 
     *
     * @summary Get user webhooks by tag
     * @param { UserApiGetUserWebhooksPublicByTagParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public getUserWebhooksPublicByTag(params: UserApiGetUserWebhooksPublicByTagParams, options?: any): Promise<Array<UserWebhookOut>> {
        const localVarFetchArgs = UserApiFetchParamCreator.getUserWebhooksPublicByTag(params?.tag, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * 
     *
     * @summary Get webhook endpoint details
     * @param { UserApiGetWebhookEndpointByIdParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public getWebhookEndpointById(params: UserApiGetWebhookEndpointByIdParams, options?: any): Promise<EndpointOut> {
        const localVarFetchArgs = UserApiFetchParamCreator.getWebhookEndpointById(params?.webhookId, params?.endpointId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * 
     *
     * @summary Get webhook endpoint list
     * @param { UserApiGetWebhookEndpointsParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public getWebhookEndpoints(params: UserApiGetWebhookEndpointsParams, options?: any): Promise<Array<EndpointOut>> {
        const localVarFetchArgs = UserApiFetchParamCreator.getWebhookEndpoints(params?.webhookId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * 
     *
     * @summary Update webhook endpoint details
     * @param { UserApiUpdateWebhookEndpointByIdParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public updateWebhookEndpointById(params: UserApiUpdateWebhookEndpointByIdParams, options?: any): Promise<EndpointOut> {
        const localVarFetchArgs = UserApiFetchParamCreator.updateWebhookEndpointById(params?.body, params?.webhookId, params?.endpointId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Webhooks must be preconfigured using POST /applications/{application_id}/webhooks
     *
     * @summary Subscribe current user to application's webhooks
     * @param { UserApiUserSubscribeParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public subscribe(params: UserApiUserSubscribeParams, options?: any): Promise<ModelObject> {
        const localVarFetchArgs = UserApiFetchParamCreator.subscribe(params?.applicationId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * 
     *
     * @summary Unsubscribe current user from application's webhooks
     * @param { UserApiUserUnsubscribeParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public unsubscribe(params: UserApiUserUnsubscribeParams, options?: any): Promise<ModelObject> {
        const localVarFetchArgs = UserApiFetchParamCreator.unsubscribe(params?.applicationId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

}

export interface Apis {
    default: DefaultApi;
    developer: DeveloperApi;
    user: UserApi;
}

export default (configuration: ApiConfiguration, credentialStorage: CredentialStorage): Apis => ({
    default: new DefaultApi(configuration, credentialStorage),
    developer: new DeveloperApi(configuration, credentialStorage),
    user: new UserApi(configuration, credentialStorage),
})