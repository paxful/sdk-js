import * as url from "url";
import { CredentialStorage } from "../../oauth";
import { ApiConfiguration } from "../../ApiConfiguration";
import { executeRequestAuthorized } from "../../commands";
import { RequestBuilder } from "../../commands/Invoke";
import { Blob, Response } from "node-fetch";

/**
 *
 * @export
 */
export const COLLECTION_FORMATS = {
    csv: ",",
    ssv: " ",
    tsv: "\t",
    pipes: "|",
};

/**
 *
 * @export
 * @interface FetchArgs
 */
export interface FetchArgs {
    url: string;
    options: any;
}

/**
 *
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
 *
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
     * @type {string}
     * @memberof LogRecordOut
     */
    applicationId: string;
    /**
     * 
     * @type {number}
     * @memberof LogRecordOut
     */
    endpointId: number;
    /**
     * 
     * @type {string}
     * @memberof LogRecordOut
     */
    userId: string;
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
    requestBody: string;
    /**
     * 
     * @type {string}
     * @memberof LogRecordOut
     */
    requestHeaders: string;
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
    responseHeaders: string;
    /**
     * 
     * @type {string}
     * @memberof LogRecordOut
     */
    responseBody: string;
    /**
     * 
     * @type {boolean}
     * @memberof LogRecordOut
     */
    success: boolean;
    /**
     * 
     * @type {number}
     * @memberof LogRecordOut
     */
    id: number;
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
    applicationId: string;
    /**
     * 
     * @type {string}
     * @memberof WebhookOut
     */
    developerId: string;
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
     * @type {Array<EndpointOut>}
     * @memberof WebhookOut
     */
    endpoints: Array<EndpointOut>;
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
    getLogs(applicationId: string, options: any = {}): FetchArgs {
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
    webhookCreate(body: WebhookIn, applicationId: string, options: any = {}): FetchArgs {
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
    webhookDelete(applicationId: string, options: any = {}): FetchArgs {
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
    webhookGet(applicationId: string, options: any = {}): FetchArgs {
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
    webhookUpdate(body: WebhookIn, applicationId: string, options: any = {}): FetchArgs {
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
 * @export
 * @class DeveloperApi
 * @extends {BaseAPI}
 */
export class DeveloperApi extends BaseAPI {
    /**
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
    addUserWebhooks(body: WebhookIn, applicationId: string, options: any = {}): FetchArgs {
        // verify required parameter 'body' is not null or undefined
        if (body === null || body === undefined) {
            throw new RequiredError('body','Required parameter body was null or undefined when calling addUserWebhooks.');
        }
        // verify required parameter 'applicationId' is not null or undefined
        if (applicationId === null || applicationId === undefined) {
            throw new RequiredError('applicationId','Required parameter applicationId was null or undefined when calling addUserWebhooks.');
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
     * Webhooks must be preconfigured using POST /applications/{application_id}/webhooks
     * @summary Subscribe current user to application's webhooks
     * @param {string} applicationId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    userSubscribe(applicationId: string, options: any = {}): FetchArgs {
        // verify required parameter 'applicationId' is not null or undefined
        if (applicationId === null || applicationId === undefined) {
            throw new RequiredError('applicationId','Required parameter applicationId was null or undefined when calling userSubscribe.');
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
    userUnsubscribe(applicationId: string, options: any = {}): FetchArgs {
        // verify required parameter 'applicationId' is not null or undefined
        if (applicationId === null || applicationId === undefined) {
            throw new RequiredError('applicationId','Required parameter applicationId was null or undefined when calling userUnsubscribe.');
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

export type UserApiAddUserWebhooksParams = {
    /**
     * 
     */
    body: WebhookIn;

    /**
     * 
     */
    applicationId: string;

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
 * @export
 * @class UserApi
 * @extends {BaseAPI}
 */
export class UserApi extends BaseAPI {
    /**
     * 
     * @summary Register user-specific webhooks
     * @param { UserApiAddUserWebhooksParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public addUserWebhooks(params: UserApiAddUserWebhooksParams, options?: any): Promise<ModelObject> {
        const localVarFetchArgs = UserApiFetchParamCreator.addUserWebhooks(params?.body, params?.applicationId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Webhooks must be preconfigured using POST /applications/{application_id}/webhooks
     * @summary Subscribe current user to application's webhooks
     * @param { UserApiUserSubscribeParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public subscribe(params: UserApiUserSubscribeParams, options?: any): Promise<ModelObject> {
        const localVarFetchArgs = UserApiFetchParamCreator.userSubscribe(params?.applicationId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * 
     * @summary Unsubscribe current user from application's webhooks
     * @param { UserApiUserUnsubscribeParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public unsubscribe(params: UserApiUserUnsubscribeParams, options?: any): Promise<ModelObject> {
        const localVarFetchArgs = UserApiFetchParamCreator.userUnsubscribe(params?.applicationId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

}

export interface Apis {
    developer: DeveloperApi;
    user: UserApi;
}

export default (configuration: ApiConfiguration, credentialStorage: CredentialStorage): Apis => ({
    developer: new DeveloperApi(configuration, credentialStorage),
    user: new UserApi(configuration, credentialStorage),
})