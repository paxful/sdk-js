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
 * An enumeration.
 * @export
 * @enum {string}
 */
export enum ApiType {
    User = <any> 'user',
    Application = <any> 'application'
}
/**
 * 
 * @export
 * @interface EndpointIn
 */
export interface EndpointIn {
    /**
     * A target URL where a webhook will be dispatched to when an event of type 'event_type' occurs.
     * @type {string}
     * @memberof EndpointIn
     */
    url: string;
    /**
     * If a given webhook is enabled or not.
     * @type {boolean}
     * @memberof EndpointIn
     */
    enabled?: boolean;
    /**
     * Technical name of event that you would like to subscribe to. For a list of available supported types of webhooks please refer to an API product documentation that you would to integrate with.
     * @type {string}
     * @memberof EndpointIn
     */
    eventType: string;
}
/**
 * 
 * @export
 * @interface EndpointOut
 */
export interface EndpointOut {
    /**
     * 
     * @type {number}
     * @memberof EndpointOut
     */
    id: number;
    /**
     * A target URL where a webhook will be dispatched to when an event of type 'event_type' occurs.
     * @type {string}
     * @memberof EndpointOut
     */
    url: string;
    /**
     * If a given webhook is enabled or not.
     * @type {boolean}
     * @memberof EndpointOut
     */
    enabled?: boolean;
    /**
     * 
     * @type {string}
     * @memberof EndpointOut
     */
    errorCode?: string;
    /**
     * Technical name of event that you would like to subscribe to. For a list of available supported types of webhooks please refer to an API product documentation that you would to integrate with.
     * @type {string}
     * @memberof EndpointOut
     */
    eventType: string;
    /**
     * 
     * @type {Date}
     * @memberof EndpointOut
     */
    lastActivity?: Date;
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
     * Target URL where this webhook invocation was targeting.
     * @type {string}
     * @memberof LogRecordOut
     */
    url: string;
    /**
     * 
     * @type {Date}
     * @memberof LogRecordOut
     */
    sentAt: Date;
    /**
     * If a given webhook invocation was successful.
     * @type {boolean}
     * @memberof LogRecordOut
     */
    success: boolean;
    /**
     * Either HTTP code returned from a server OR a short descriptivename of an error, e.g. timeout.
     * @type {string}
     * @memberof LogRecordOut
     */
    errorCode?: string;
    /**
     * Payload that a given webhook invocation's payload had.
     * @type {string}
     * @memberof LogRecordOut
     */
    requestBody?: string;
    /**
     * Response from the server. This property will be defined only if correct value for 'X-Paxful-Request-Challenge' request header was provided in server response headers.
     * @type {string}
     * @memberof LogRecordOut
     */
    responseBody?: string;
    /**
     * Headers that a given webhook invocation had.
     * @type {string}
     * @memberof LogRecordOut
     */
    requestHeaders?: string;
    /**
     * HTTP code that 'url' returned when this webhook was dispatched.
     * @type {number}
     * @memberof LogRecordOut
     */
    responseStatus: number;
    /**
     * Headers that a 'url' server responded with when this webhook was dispatched.
     * @type {string}
     * @memberof LogRecordOut
     */
    responseHeaders?: string;
    /**
     * A detailed description of an error from 'error_code'.
     * @type {string}
     * @memberof LogRecordOut
     */
    errorDescription?: string;
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
 * @interface WebhookDelegatedOut
 */
export interface WebhookDelegatedOut {
    /**
     * Optional tag. Tags can be used to simplify management of webhooks. For more details see /application/webhooks/tag/_* family of endpoints.
     * @type {string}
     * @memberof WebhookDelegatedOut
     */
    tag?: string;
    /**
     * UID of a user a given webhook belongs to.
     * @type {string}
     * @memberof WebhookDelegatedOut
     */
    userId?: string;
    /**
     * 
     * @type {Array<EndpointOut>}
     * @memberof WebhookDelegatedOut
     */
    endpoints: Array<EndpointOut>;
    /**
     * ID of a webhook. You can use this ID to update or fetch logs of a webhook.
     * @type {string}
     * @memberof WebhookDelegatedOut
     */
    webhookId: string;
    /**
     * 
     * @type {LogRecordOut}
     * @memberof WebhookDelegatedOut
     */
    lastRequest?: LogRecordOut;
    /**
     * ID of of an application this webhook belongs to.
     * @type {string}
     * @memberof WebhookDelegatedOut
     */
    applicationId?: string;
}
/**
 * 
 * @export
 * @interface WebhookIn
 */
export interface WebhookIn {
    /**
     * An optional tag. See also /user/webhooks/tag/_* or /application/webhooks/tag/_* endpoints.
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
 * DelegatedAccessApi - fetch parameter creator
 * @export
 */
export const DelegatedAccessApiFetchParamCreator = {
    /**
     * Add a new webhook. If a user uninstalls an application at some point then all their webhooks will removed automatically as well.
     * @summary /application/webhooks
     * @param {WebhookIn} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    applicationAddUserWebhook(body?: WebhookIn, options: any = {}): FetchArgs {
        // verify required parameter 'body' is not null or undefined
        if (body === null || body === undefined) {
            throw new RequiredError('body','Required parameter body was null or undefined when calling applicationAddUserWebhook.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/application/webhooks`;
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
     * Get webhook endpoint details.
     * @summary /application/webhooks/{webhook_id}/endpoints/
     * @param {EndpointIn} body 
     * @param {string} webhookId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    applicationAddWebhookEndpoint(body?: EndpointIn, webhookId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'body' is not null or undefined
        if (body === null || body === undefined) {
            throw new RequiredError('body','Required parameter body was null or undefined when calling applicationAddWebhookEndpoint.');
        }
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling applicationAddWebhookEndpoint.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/application/webhooks/{webhook_id}/endpoints/`
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
     * Remove all webhooks that current user had configured by a given application.
     * @summary /application/webhooks
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    applicationDeleteAllUserWebhooks(options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/application/webhooks`;
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
     * Remove webhooks with given tag.
     * @summary /application/webhooks/tags/{tag}
     * @param {string} tag 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    applicationDeleteAllUserWebhooksByTag(tag?: string, options: any = {}): FetchArgs {
        // verify required parameter 'tag' is not null or undefined
        if (tag === null || tag === undefined) {
            throw new RequiredError('tag','Required parameter tag was null or undefined when calling applicationDeleteAllUserWebhooksByTag.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/application/webhooks/tags/{tag}`
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
     * Remove webhook by ID.
     * @summary /application/webhooks/{webhook_id}
     * @param {string} webhookId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    applicationDeleteUserWebhooks(webhookId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling applicationDeleteUserWebhooks.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/application/webhooks/{webhook_id}`
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
     * Get webhook endpoint details.
     * @summary /application/webhooks/{webhook_id}/endpoints/{endpoint_id}
     * @param {string} webhookId 
     * @param {number} endpointId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    applicationDeleteWebhookEndpointById(webhookId?: string, endpointId?: number, options: any = {}): FetchArgs {
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling applicationDeleteWebhookEndpointById.');
        }
        // verify required parameter 'endpointId' is not null or undefined
        if (endpointId === null || endpointId === undefined) {
            throw new RequiredError('endpointId','Required parameter endpointId was null or undefined when calling applicationDeleteWebhookEndpointById.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/application/webhooks/{webhook_id}/endpoints/{endpoint_id}`
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
     * Get webhook http request log for the endpoint.
     * @summary /application/webhooks/{webhook_id}/endpoints/{endpoint_id}/log
     * @param {string} webhookId 
     * @param {number} endpointId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    applicationGetEndpointLogs(webhookId?: string, endpointId?: number, options: any = {}): FetchArgs {
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling applicationGetEndpointLogs.');
        }
        // verify required parameter 'endpointId' is not null or undefined
        if (endpointId === null || endpointId === undefined) {
            throw new RequiredError('endpointId','Required parameter endpointId was null or undefined when calling applicationGetEndpointLogs.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/application/webhooks/{webhook_id}/endpoints/{endpoint_id}/log`
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
     * Get webhook's requests log. You can use this endpoint for troubleshooting purposes.
     * @summary /application/webhooks/log
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    applicationGetLogs(options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/application/webhooks/log`;
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
     * Get webhook details.
     * @summary /application/webhooks/{webhook_id}
     * @param {string} webhookId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    applicationGetUserWebhookDetails(webhookId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling applicationGetUserWebhookDetails.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/application/webhooks/{webhook_id}`
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
     * Get all webhooks that current application has configured for current user.
     * @summary /application/webhooks
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    applicationGetUserWebhooks(options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/application/webhooks`;
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
     * Get all user webhooks by tag that current application configured for current user.
     * @summary /application/webhooks/tags/{tag}
     * @param {string} tag 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    applicationGetUserWebhooksPublicByTag(tag?: string, options: any = {}): FetchArgs {
        // verify required parameter 'tag' is not null or undefined
        if (tag === null || tag === undefined) {
            throw new RequiredError('tag','Required parameter tag was null or undefined when calling applicationGetUserWebhooksPublicByTag.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/application/webhooks/tags/{tag}`
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
     * Get webhook endpoint details.
     * @summary /application/webhooks/{webhook_id}/endpoints/{endpoint_id}
     * @param {string} webhookId 
     * @param {number} endpointId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    applicationGetWebhookEndpointById(webhookId?: string, endpointId?: number, options: any = {}): FetchArgs {
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling applicationGetWebhookEndpointById.');
        }
        // verify required parameter 'endpointId' is not null or undefined
        if (endpointId === null || endpointId === undefined) {
            throw new RequiredError('endpointId','Required parameter endpointId was null or undefined when calling applicationGetWebhookEndpointById.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/application/webhooks/{webhook_id}/endpoints/{endpoint_id}`
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
     * Get webhook endpoint list.
     * @summary /application/webhooks/{webhook_id}/endpoints/
     * @param {string} webhookId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    applicationGetWebhookEndpoints(webhookId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling applicationGetWebhookEndpoints.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/application/webhooks/{webhook_id}/endpoints/`
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
     * Update webhook endpoint details.
     * @summary /application/webhooks/{webhook_id}/endpoints/{endpoint_id}
     * @param {EndpointIn} body 
     * @param {string} webhookId 
     * @param {number} endpointId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    applicationUpdateWebhookEndpointById(body?: EndpointIn, webhookId?: string, endpointId?: number, options: any = {}): FetchArgs {
        // verify required parameter 'body' is not null or undefined
        if (body === null || body === undefined) {
            throw new RequiredError('body','Required parameter body was null or undefined when calling applicationUpdateWebhookEndpointById.');
        }
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling applicationUpdateWebhookEndpointById.');
        }
        // verify required parameter 'endpointId' is not null or undefined
        if (endpointId === null || endpointId === undefined) {
            throw new RequiredError('endpointId','Required parameter endpointId was null or undefined when calling applicationUpdateWebhookEndpointById.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/application/webhooks/{webhook_id}/endpoints/{endpoint_id}`
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
};

export type DelegatedAccessApiApplicationAddUserWebhookParams = {
    /**
     * 
     */
    body?: WebhookIn;

}

export type DelegatedAccessApiApplicationAddWebhookEndpointParams = {
    /**
     * 
     */
    body?: EndpointIn;

    /**
     * 
     */
    webhookId?: string;

}

export type DelegatedAccessApiApplicationDeleteAllUserWebhooksParams = {
}

export type DelegatedAccessApiApplicationDeleteAllUserWebhooksByTagParams = {
    /**
     * 
     */
    tag?: string;

}

export type DelegatedAccessApiApplicationDeleteUserWebhooksParams = {
    /**
     * 
     */
    webhookId?: string;

}

export type DelegatedAccessApiApplicationDeleteWebhookEndpointByIdParams = {
    /**
     * 
     */
    webhookId?: string;

    /**
     * 
     */
    endpointId?: number;

}

export type DelegatedAccessApiApplicationGetEndpointLogsParams = {
    /**
     * 
     */
    webhookId?: string;

    /**
     * 
     */
    endpointId?: number;

}

export type DelegatedAccessApiApplicationGetLogsParams = {
}

export type DelegatedAccessApiApplicationGetUserWebhookDetailsParams = {
    /**
     * 
     */
    webhookId?: string;

}

export type DelegatedAccessApiApplicationGetUserWebhooksParams = {
}

export type DelegatedAccessApiApplicationGetUserWebhooksPublicByTagParams = {
    /**
     * 
     */
    tag?: string;

}

export type DelegatedAccessApiApplicationGetWebhookEndpointByIdParams = {
    /**
     * 
     */
    webhookId?: string;

    /**
     * 
     */
    endpointId?: number;

}

export type DelegatedAccessApiApplicationGetWebhookEndpointsParams = {
    /**
     * 
     */
    webhookId?: string;

}

export type DelegatedAccessApiApplicationUpdateWebhookEndpointByIdParams = {
    /**
     * 
     */
    body?: EndpointIn;

    /**
     * 
     */
    webhookId?: string;

    /**
     * 
     */
    endpointId?: number;

}


/**
 * DelegatedAccessApi
 *
 * @export
 * @class DelegatedAccessApi
 * @extends {BaseAPI}
 */
export class DelegatedAccessApi extends BaseAPI {
    /**
     * Add a new webhook. If a user uninstalls an application at some point then all their webhooks will removed automatically as well.
     *
     * @summary /application/webhooks
     * @param { DelegatedAccessApiApplicationAddUserWebhookParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DelegatedAccessApi
     */
    public applicationAddUserWebhook(params?: DelegatedAccessApiApplicationAddUserWebhookParams, options?: any): Promise<WebhookDelegatedOut> {
        const localVarFetchArgs = DelegatedAccessApiFetchParamCreator.applicationAddUserWebhook(params?.body, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Get webhook endpoint details.
     *
     * @summary /application/webhooks/{webhook_id}/endpoints/
     * @param { DelegatedAccessApiApplicationAddWebhookEndpointParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DelegatedAccessApi
     */
    public applicationAddWebhookEndpoint(params: DelegatedAccessApiApplicationAddWebhookEndpointParams, options?: any): Promise<Array<EndpointOut>> {
        const localVarFetchArgs = DelegatedAccessApiFetchParamCreator.applicationAddWebhookEndpoint(params?.body, params?.webhookId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Remove all webhooks that current user had configured by a given application.
     *
     * @summary /application/webhooks
     * @param { DelegatedAccessApiApplicationDeleteAllUserWebhooksParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DelegatedAccessApi
     */
    public applicationDeleteAllUserWebhooks(options?: any): Promise<ModelObject> {
        const localVarFetchArgs = DelegatedAccessApiFetchParamCreator.applicationDeleteAllUserWebhooks(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Remove webhooks with given tag.
     *
     * @summary /application/webhooks/tags/{tag}
     * @param { DelegatedAccessApiApplicationDeleteAllUserWebhooksByTagParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DelegatedAccessApi
     */
    public applicationDeleteAllUserWebhooksByTag(params: DelegatedAccessApiApplicationDeleteAllUserWebhooksByTagParams, options?: any): Promise<ModelObject> {
        const localVarFetchArgs = DelegatedAccessApiFetchParamCreator.applicationDeleteAllUserWebhooksByTag(params?.tag, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Remove webhook by ID.
     *
     * @summary /application/webhooks/{webhook_id}
     * @param { DelegatedAccessApiApplicationDeleteUserWebhooksParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DelegatedAccessApi
     */
    public applicationDeleteUserWebhooks(params: DelegatedAccessApiApplicationDeleteUserWebhooksParams, options?: any): Promise<ModelObject> {
        const localVarFetchArgs = DelegatedAccessApiFetchParamCreator.applicationDeleteUserWebhooks(params?.webhookId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Get webhook endpoint details.
     *
     * @summary /application/webhooks/{webhook_id}/endpoints/{endpoint_id}
     * @param { DelegatedAccessApiApplicationDeleteWebhookEndpointByIdParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DelegatedAccessApi
     */
    public applicationDeleteWebhookEndpointById(params: DelegatedAccessApiApplicationDeleteWebhookEndpointByIdParams, options?: any): Promise<ModelObject> {
        const localVarFetchArgs = DelegatedAccessApiFetchParamCreator.applicationDeleteWebhookEndpointById(params?.webhookId, params?.endpointId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Get webhook http request log for the endpoint.
     *
     * @summary /application/webhooks/{webhook_id}/endpoints/{endpoint_id}/log
     * @param { DelegatedAccessApiApplicationGetEndpointLogsParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DelegatedAccessApi
     */
    public applicationGetEndpointLogs(params: DelegatedAccessApiApplicationGetEndpointLogsParams, options?: any): Promise<Array<LogRecordOut>> {
        const localVarFetchArgs = DelegatedAccessApiFetchParamCreator.applicationGetEndpointLogs(params?.webhookId, params?.endpointId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Get webhook's requests log. You can use this endpoint for troubleshooting purposes.
     *
     * @summary /application/webhooks/log
     * @param { DelegatedAccessApiApplicationGetLogsParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DelegatedAccessApi
     */
    public applicationGetLogs(options?: any): Promise<Array<LogRecordOut>> {
        const localVarFetchArgs = DelegatedAccessApiFetchParamCreator.applicationGetLogs(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Get webhook details.
     *
     * @summary /application/webhooks/{webhook_id}
     * @param { DelegatedAccessApiApplicationGetUserWebhookDetailsParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DelegatedAccessApi
     */
    public applicationGetUserWebhookDetails(params: DelegatedAccessApiApplicationGetUserWebhookDetailsParams, options?: any): Promise<WebhookDelegatedOut> {
        const localVarFetchArgs = DelegatedAccessApiFetchParamCreator.applicationGetUserWebhookDetails(params?.webhookId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Get all webhooks that current application has configured for current user.
     *
     * @summary /application/webhooks
     * @param { DelegatedAccessApiApplicationGetUserWebhooksParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DelegatedAccessApi
     */
    public applicationGetUserWebhooks(options?: any): Promise<Array<WebhookDelegatedOut>> {
        const localVarFetchArgs = DelegatedAccessApiFetchParamCreator.applicationGetUserWebhooks(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Get all user webhooks by tag that current application configured for current user.
     *
     * @summary /application/webhooks/tags/{tag}
     * @param { DelegatedAccessApiApplicationGetUserWebhooksPublicByTagParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DelegatedAccessApi
     */
    public applicationGetUserWebhooksPublicByTag(params: DelegatedAccessApiApplicationGetUserWebhooksPublicByTagParams, options?: any): Promise<Array<WebhookDelegatedOut>> {
        const localVarFetchArgs = DelegatedAccessApiFetchParamCreator.applicationGetUserWebhooksPublicByTag(params?.tag, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Get webhook endpoint details.
     *
     * @summary /application/webhooks/{webhook_id}/endpoints/{endpoint_id}
     * @param { DelegatedAccessApiApplicationGetWebhookEndpointByIdParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DelegatedAccessApi
     */
    public applicationGetWebhookEndpointById(params: DelegatedAccessApiApplicationGetWebhookEndpointByIdParams, options?: any): Promise<EndpointOut> {
        const localVarFetchArgs = DelegatedAccessApiFetchParamCreator.applicationGetWebhookEndpointById(params?.webhookId, params?.endpointId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Get webhook endpoint list.
     *
     * @summary /application/webhooks/{webhook_id}/endpoints/
     * @param { DelegatedAccessApiApplicationGetWebhookEndpointsParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DelegatedAccessApi
     */
    public applicationGetWebhookEndpoints(params: DelegatedAccessApiApplicationGetWebhookEndpointsParams, options?: any): Promise<Array<EndpointOut>> {
        const localVarFetchArgs = DelegatedAccessApiFetchParamCreator.applicationGetWebhookEndpoints(params?.webhookId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Update webhook endpoint details.
     *
     * @summary /application/webhooks/{webhook_id}/endpoints/{endpoint_id}
     * @param { DelegatedAccessApiApplicationUpdateWebhookEndpointByIdParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DelegatedAccessApi
     */
    public applicationUpdateWebhookEndpointById(params: DelegatedAccessApiApplicationUpdateWebhookEndpointByIdParams, options?: any): Promise<EndpointOut> {
        const localVarFetchArgs = DelegatedAccessApiFetchParamCreator.applicationUpdateWebhookEndpointById(params?.body, params?.webhookId, params?.endpointId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

}
/**
 * DirectAccessApi - fetch parameter creator
 * @export
 */
export const DirectAccessApiFetchParamCreator = {
    /**
     * Add user personal webhook.
     * @summary /user/webhooks
     * @param {WebhookIn} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    userAddUserWebhook(body?: WebhookIn, options: any = {}): FetchArgs {
        // verify required parameter 'body' is not null or undefined
        if (body === null || body === undefined) {
            throw new RequiredError('body','Required parameter body was null or undefined when calling userAddUserWebhook.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/user/webhooks`;
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
     * Get webhook endpoint details.
     * @summary /user/webhooks/{webhook_id}/endpoints/
     * @param {EndpointIn} body 
     * @param {string} webhookId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    userAddWebhookEndpoint(body?: EndpointIn, webhookId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'body' is not null or undefined
        if (body === null || body === undefined) {
            throw new RequiredError('body','Required parameter body was null or undefined when calling userAddWebhookEndpoint.');
        }
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling userAddWebhookEndpoint.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/user/webhooks/{webhook_id}/endpoints/`
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
     * See also /user/webhooks/tags/_* endpoints.
     * @summary /user/webhooks
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    userDeleteAllUserWebhooks(options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/user/webhooks`;
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
     * Remove user personal webhook by ID.
     * @summary /user/webhooks/tags/{tag}
     * @param {string} tag 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    userDeleteAllUserWebhooksByTag(tag?: string, options: any = {}): FetchArgs {
        // verify required parameter 'tag' is not null or undefined
        if (tag === null || tag === undefined) {
            throw new RequiredError('tag','Required parameter tag was null or undefined when calling userDeleteAllUserWebhooksByTag.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/user/webhooks/tags/{tag}`
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
     * Remove user personal webhook by ID.
     * @summary /user/webhooks/{webhook_id}
     * @param {string} webhookId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    userDeleteUserWebhooks(webhookId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling userDeleteUserWebhooks.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/user/webhooks/{webhook_id}`
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
     * Get webhook endpoint details.
     * @summary /user/webhooks/{webhook_id}/endpoints/{endpoint_id}
     * @param {string} webhookId 
     * @param {number} endpointId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    userDeleteWebhookEndpointById(webhookId?: string, endpointId?: number, options: any = {}): FetchArgs {
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling userDeleteWebhookEndpointById.');
        }
        // verify required parameter 'endpointId' is not null or undefined
        if (endpointId === null || endpointId === undefined) {
            throw new RequiredError('endpointId','Required parameter endpointId was null or undefined when calling userDeleteWebhookEndpointById.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/user/webhooks/{webhook_id}/endpoints/{endpoint_id}`
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
     * Get webhook http request log for the endpoint.
     * @summary /user/webhooks/{webhook_id}/endpoints/{endpoint_id}/log
     * @param {string} webhookId 
     * @param {number} endpointId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    userGetEndpointLogs(webhookId?: string, endpointId?: number, options: any = {}): FetchArgs {
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling userGetEndpointLogs.');
        }
        // verify required parameter 'endpointId' is not null or undefined
        if (endpointId === null || endpointId === undefined) {
            throw new RequiredError('endpointId','Required parameter endpointId was null or undefined when calling userGetEndpointLogs.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/user/webhooks/{webhook_id}/endpoints/{endpoint_id}/log`
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
     * You can use this endpoint for troubleshooting purpose.
     * @summary /user/webhooks/log
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    userGetLogs(options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/user/webhooks/log`;
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
     * Get webhook details.
     * @summary /user/webhooks/{webhook_id}
     * @param {string} webhookId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    userGetUserWebhookDetails(webhookId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling userGetUserWebhookDetails.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/user/webhooks/{webhook_id}`
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
     * Get list of user personal webhooks.
     * @summary /user/webhooks
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    userGetUserWebhooks(options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/user/webhooks`;
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
     * Get user webhooks by tag.
     * @summary /user/webhooks/tags/{tag}
     * @param {string} tag 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    userGetUserWebhooksPublicByTag(tag?: string, options: any = {}): FetchArgs {
        // verify required parameter 'tag' is not null or undefined
        if (tag === null || tag === undefined) {
            throw new RequiredError('tag','Required parameter tag was null or undefined when calling userGetUserWebhooksPublicByTag.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/user/webhooks/tags/{tag}`
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
     * Get webhook endpoint details.
     * @summary /user/webhooks/{webhook_id}/endpoints/{endpoint_id}
     * @param {string} webhookId 
     * @param {number} endpointId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    userGetWebhookEndpointById(webhookId?: string, endpointId?: number, options: any = {}): FetchArgs {
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling userGetWebhookEndpointById.');
        }
        // verify required parameter 'endpointId' is not null or undefined
        if (endpointId === null || endpointId === undefined) {
            throw new RequiredError('endpointId','Required parameter endpointId was null or undefined when calling userGetWebhookEndpointById.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/user/webhooks/{webhook_id}/endpoints/{endpoint_id}`
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
     * Get webhook endpoint list.
     * @summary /user/webhooks/{webhook_id}/endpoints/
     * @param {string} webhookId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    userGetWebhookEndpoints(webhookId?: string, options: any = {}): FetchArgs {
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling userGetWebhookEndpoints.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/user/webhooks/{webhook_id}/endpoints/`
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
     * Update webhook endpoint details.
     * @summary /user/webhooks/{webhook_id}/endpoints/{endpoint_id}
     * @param {EndpointIn} body 
     * @param {string} webhookId 
     * @param {number} endpointId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    userUpdateWebhookEndpointById(body?: EndpointIn, webhookId?: string, endpointId?: number, options: any = {}): FetchArgs {
        // verify required parameter 'body' is not null or undefined
        if (body === null || body === undefined) {
            throw new RequiredError('body','Required parameter body was null or undefined when calling userUpdateWebhookEndpointById.');
        }
        // verify required parameter 'webhookId' is not null or undefined
        if (webhookId === null || webhookId === undefined) {
            throw new RequiredError('webhookId','Required parameter webhookId was null or undefined when calling userUpdateWebhookEndpointById.');
        }
        // verify required parameter 'endpointId' is not null or undefined
        if (endpointId === null || endpointId === undefined) {
            throw new RequiredError('endpointId','Required parameter endpointId was null or undefined when calling userUpdateWebhookEndpointById.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/user/webhooks/{webhook_id}/endpoints/{endpoint_id}`
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
};

export type DirectAccessApiUserAddUserWebhookParams = {
    /**
     * 
     */
    body?: WebhookIn;

}

export type DirectAccessApiUserAddWebhookEndpointParams = {
    /**
     * 
     */
    body?: EndpointIn;

    /**
     * 
     */
    webhookId?: string;

}

export type DirectAccessApiUserDeleteAllUserWebhooksParams = {
}

export type DirectAccessApiUserDeleteAllUserWebhooksByTagParams = {
    /**
     * 
     */
    tag?: string;

}

export type DirectAccessApiUserDeleteUserWebhooksParams = {
    /**
     * 
     */
    webhookId?: string;

}

export type DirectAccessApiUserDeleteWebhookEndpointByIdParams = {
    /**
     * 
     */
    webhookId?: string;

    /**
     * 
     */
    endpointId?: number;

}

export type DirectAccessApiUserGetEndpointLogsParams = {
    /**
     * 
     */
    webhookId?: string;

    /**
     * 
     */
    endpointId?: number;

}

export type DirectAccessApiUserGetLogsParams = {
}

export type DirectAccessApiUserGetUserWebhookDetailsParams = {
    /**
     * 
     */
    webhookId?: string;

}

export type DirectAccessApiUserGetUserWebhooksParams = {
}

export type DirectAccessApiUserGetUserWebhooksPublicByTagParams = {
    /**
     * 
     */
    tag?: string;

}

export type DirectAccessApiUserGetWebhookEndpointByIdParams = {
    /**
     * 
     */
    webhookId?: string;

    /**
     * 
     */
    endpointId?: number;

}

export type DirectAccessApiUserGetWebhookEndpointsParams = {
    /**
     * 
     */
    webhookId?: string;

}

export type DirectAccessApiUserUpdateWebhookEndpointByIdParams = {
    /**
     * 
     */
    body?: EndpointIn;

    /**
     * 
     */
    webhookId?: string;

    /**
     * 
     */
    endpointId?: number;

}


/**
 * DirectAccessApi
 *
 * @export
 * @class DirectAccessApi
 * @extends {BaseAPI}
 */
export class DirectAccessApi extends BaseAPI {
    /**
     * Add user personal webhook.
     *
     * @summary /user/webhooks
     * @param { DirectAccessApiUserAddUserWebhookParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DirectAccessApi
     */
    public userAddUserWebhook(params?: DirectAccessApiUserAddUserWebhookParams, options?: any): Promise<WebhookDelegatedOut> {
        const localVarFetchArgs = DirectAccessApiFetchParamCreator.userAddUserWebhook(params?.body, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Get webhook endpoint details.
     *
     * @summary /user/webhooks/{webhook_id}/endpoints/
     * @param { DirectAccessApiUserAddWebhookEndpointParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DirectAccessApi
     */
    public userAddWebhookEndpoint(params: DirectAccessApiUserAddWebhookEndpointParams, options?: any): Promise<Array<EndpointOut>> {
        const localVarFetchArgs = DirectAccessApiFetchParamCreator.userAddWebhookEndpoint(params?.body, params?.webhookId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * See also /user/webhooks/tags/_* endpoints.
     *
     * @summary /user/webhooks
     * @param { DirectAccessApiUserDeleteAllUserWebhooksParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DirectAccessApi
     */
    public userDeleteAllUserWebhooks(options?: any): Promise<ModelObject> {
        const localVarFetchArgs = DirectAccessApiFetchParamCreator.userDeleteAllUserWebhooks(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Remove user personal webhook by ID.
     *
     * @summary /user/webhooks/tags/{tag}
     * @param { DirectAccessApiUserDeleteAllUserWebhooksByTagParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DirectAccessApi
     */
    public userDeleteAllUserWebhooksByTag(params: DirectAccessApiUserDeleteAllUserWebhooksByTagParams, options?: any): Promise<ModelObject> {
        const localVarFetchArgs = DirectAccessApiFetchParamCreator.userDeleteAllUserWebhooksByTag(params?.tag, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Remove user personal webhook by ID.
     *
     * @summary /user/webhooks/{webhook_id}
     * @param { DirectAccessApiUserDeleteUserWebhooksParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DirectAccessApi
     */
    public userDeleteUserWebhooks(params: DirectAccessApiUserDeleteUserWebhooksParams, options?: any): Promise<ModelObject> {
        const localVarFetchArgs = DirectAccessApiFetchParamCreator.userDeleteUserWebhooks(params?.webhookId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Get webhook endpoint details.
     *
     * @summary /user/webhooks/{webhook_id}/endpoints/{endpoint_id}
     * @param { DirectAccessApiUserDeleteWebhookEndpointByIdParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DirectAccessApi
     */
    public userDeleteWebhookEndpointById(params: DirectAccessApiUserDeleteWebhookEndpointByIdParams, options?: any): Promise<ModelObject> {
        const localVarFetchArgs = DirectAccessApiFetchParamCreator.userDeleteWebhookEndpointById(params?.webhookId, params?.endpointId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Get webhook http request log for the endpoint.
     *
     * @summary /user/webhooks/{webhook_id}/endpoints/{endpoint_id}/log
     * @param { DirectAccessApiUserGetEndpointLogsParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DirectAccessApi
     */
    public userGetEndpointLogs(params: DirectAccessApiUserGetEndpointLogsParams, options?: any): Promise<Array<LogRecordOut>> {
        const localVarFetchArgs = DirectAccessApiFetchParamCreator.userGetEndpointLogs(params?.webhookId, params?.endpointId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * You can use this endpoint for troubleshooting purpose.
     *
     * @summary /user/webhooks/log
     * @param { DirectAccessApiUserGetLogsParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DirectAccessApi
     */
    public userGetLogs(options?: any): Promise<Array<LogRecordOut>> {
        const localVarFetchArgs = DirectAccessApiFetchParamCreator.userGetLogs(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Get webhook details.
     *
     * @summary /user/webhooks/{webhook_id}
     * @param { DirectAccessApiUserGetUserWebhookDetailsParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DirectAccessApi
     */
    public userGetUserWebhookDetails(params: DirectAccessApiUserGetUserWebhookDetailsParams, options?: any): Promise<WebhookDelegatedOut> {
        const localVarFetchArgs = DirectAccessApiFetchParamCreator.userGetUserWebhookDetails(params?.webhookId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Get list of user personal webhooks.
     *
     * @summary /user/webhooks
     * @param { DirectAccessApiUserGetUserWebhooksParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DirectAccessApi
     */
    public userGetUserWebhooks(options?: any): Promise<Array<WebhookDelegatedOut>> {
        const localVarFetchArgs = DirectAccessApiFetchParamCreator.userGetUserWebhooks(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Get user webhooks by tag.
     *
     * @summary /user/webhooks/tags/{tag}
     * @param { DirectAccessApiUserGetUserWebhooksPublicByTagParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DirectAccessApi
     */
    public userGetUserWebhooksPublicByTag(params: DirectAccessApiUserGetUserWebhooksPublicByTagParams, options?: any): Promise<Array<WebhookDelegatedOut>> {
        const localVarFetchArgs = DirectAccessApiFetchParamCreator.userGetUserWebhooksPublicByTag(params?.tag, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Get webhook endpoint details.
     *
     * @summary /user/webhooks/{webhook_id}/endpoints/{endpoint_id}
     * @param { DirectAccessApiUserGetWebhookEndpointByIdParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DirectAccessApi
     */
    public userGetWebhookEndpointById(params: DirectAccessApiUserGetWebhookEndpointByIdParams, options?: any): Promise<EndpointOut> {
        const localVarFetchArgs = DirectAccessApiFetchParamCreator.userGetWebhookEndpointById(params?.webhookId, params?.endpointId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Get webhook endpoint list.
     *
     * @summary /user/webhooks/{webhook_id}/endpoints/
     * @param { DirectAccessApiUserGetWebhookEndpointsParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DirectAccessApi
     */
    public userGetWebhookEndpoints(params: DirectAccessApiUserGetWebhookEndpointsParams, options?: any): Promise<Array<EndpointOut>> {
        const localVarFetchArgs = DirectAccessApiFetchParamCreator.userGetWebhookEndpoints(params?.webhookId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Update webhook endpoint details.
     *
     * @summary /user/webhooks/{webhook_id}/endpoints/{endpoint_id}
     * @param { DirectAccessApiUserUpdateWebhookEndpointByIdParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DirectAccessApi
     */
    public userUpdateWebhookEndpointById(params: DirectAccessApiUserUpdateWebhookEndpointByIdParams, options?: any): Promise<EndpointOut> {
        const localVarFetchArgs = DirectAccessApiFetchParamCreator.userUpdateWebhookEndpointById(params?.body, params?.webhookId, params?.endpointId, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

}
/**
 * MiscApi - fetch parameter creator
 * @export
 */
export const MiscApiFetchParamCreator = {
    /**
     * Get a public key. You can use this key to validate incoming webhook authenticity (i.e. that a webhook indeed was sent by a Paxful). For more details refer to <a href='!!!' target='_blank'>Validating Paxful signature</a> guide.
     * @summary /.well-known/public.key
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
};

export type MiscApiGetSignaturePublicKeyParams = {
}


/**
 * MiscApi
 *
 * @export
 * @class MiscApi
 * @extends {BaseAPI}
 */
export class MiscApi extends BaseAPI {
    /**
     * Get a public key. You can use this key to validate incoming webhook authenticity (i.e. that a webhook indeed was sent by a Paxful). For more details refer to <a href='!!!' target='_blank'>Validating Paxful signature</a> guide.
     *
     * @summary /.well-known/public.key
     * @param { MiscApiGetSignaturePublicKeyParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MiscApi
     */
    public getSignaturePublicKey(options?: any): Promise<ModelObject> {
        const localVarFetchArgs = MiscApiFetchParamCreator.getSignaturePublicKey(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

}

export interface FluentApi {
    delegatedAccess: DelegatedAccessApi;
    directAccess: DirectAccessApi;
    misc: MiscApi;
}

export default (configuration: ApiConfiguration, credentialStorage: CredentialStorage): FluentApi => ({
    delegatedAccess: new DelegatedAccessApi(configuration, credentialStorage),
    directAccess: new DirectAccessApi(configuration, credentialStorage),
    misc: new MiscApi(configuration, credentialStorage),
})