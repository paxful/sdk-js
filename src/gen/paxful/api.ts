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
 * @interface AffiliateTransactions
 */
export interface AffiliateTransactions {
    /**
     * Transaction ID.
     * @type {number}
     * @memberof AffiliateTransactions
     */
    id?: number;
    /**
     * Transaction date e.g. '2020-01-01T08:31:56+00:00'.
     * @type {string}
     * @memberof AffiliateTransactions
     */
    date?: string;
    /**
     * Kiosk transaction type. Possible values: 'Trade fee' (award from your kiosk trade transactions), 'Transfer to user balance' (transfer from your kiosk balance to your account balance).
     * @type {string}
     * @memberof AffiliateTransactions
     */
    type?: AffiliateTransactions.TypeEnum;
    /**
     * Transaction amount in BTC.
     * @type {number}
     * @memberof AffiliateTransactions
     */
    amountBtc?: number;
    /**
     * Transaction amount in USD.
     * @type {number}
     * @memberof AffiliateTransactions
     */
    amountUsd?: number;
    /**
     * Kiosk balance in BTC after this specific transaction has been made.
     * @type {number}
     * @memberof AffiliateTransactions
     */
    balanceBtc?: number;
    /**
     * Kiosk balance in USD after this specific transaction has been made.
     * @type {number}
     * @memberof AffiliateTransactions
     */
    balanceUsd?: number;
    /**
     * Payment method slug.
     * @type {string}
     * @memberof AffiliateTransactions
     */
    paymentMethod?: string;
    /**
     * Payment method name.
     * @type {string}
     * @memberof AffiliateTransactions
     */
    paymentMethodName?: string;
}

/**
 * @export
 * @namespace AffiliateTransactions
 */
export namespace AffiliateTransactions {
    /**
     * @export
     * @enum {string}
     */
    export enum TypeEnum {
        TradeFee = <any> 'Trade fee',
        TransferToUserBalance = <any> 'Transfer to user balance'
    }
}
/**
 * 
 * @export
 * @interface AffiliateTransactionsResponse
 */
export interface AffiliateTransactionsResponse {
    /**
     * Current page, by default is 1.
     * @type {number}
     * @memberof AffiliateTransactionsResponse
     */
    page?: number;
    /**
     * Number of returned transactions.
     * @type {number}
     * @memberof AffiliateTransactionsResponse
     */
    count?: number;
    /**
     * 
     * @type {Array<AffiliateTransactions>}
     * @memberof AffiliateTransactionsResponse
     */
    transactions?: Array<AffiliateTransactions>;
}
/**
 * 
 * @export
 * @interface BankAccountGetResponse
 */
export interface BankAccountGetResponse extends BankAccountResponse {
    /**
     * This parameter will only be available when working with 'trade.chat.bank_account' webhook. When invoking bank-account/get this parameter will be missing from the response.
     * @type {string}
     * @memberof BankAccountGetResponse
     */
    tradeHash?: string;
}
/**
 * 
 * @export
 * @interface BankAccountListResponse
 */
export interface BankAccountListResponse {
    /**
     * 
     * @type {Array<BankAccountResponse>}
     * @memberof BankAccountListResponse
     */
    bankAccounts?: Array<BankAccountResponse>;
}
/**
 * 
 * @export
 * @interface BankAccountResponse
 */
export interface BankAccountResponse extends RequestBodyBankAccountId {
    /**
     * IBAN.
     * @type {string}
     * @memberof BankAccountResponse
     */
    iban?: string;
    /**
     * IFSC.
     * @type {string}
     * @memberof BankAccountResponse
     */
    ifsc?: string;
    /**
     * Clabe.
     * @type {string}
     * @memberof BankAccountResponse
     */
    clabe?: string;
    /**
     * Bank name.
     * @type {string}
     * @memberof BankAccountResponse
     */
    bankName?: string;
    /**
     * Bank ID.
     * @type {string}
     * @memberof BankAccountResponse
     */
    bankUuid?: string;
    /**
     * Swift code.
     * @type {string}
     * @memberof BankAccountResponse
     */
    swiftCode?: string;
    /**
     * ISO country code of the offer owner.
     * @type {string}
     * @memberof BankAccountResponse
     */
    countryIso: string;
    /**
     * Holder name.
     * @type {string}
     * @memberof BankAccountResponse
     */
    holderName: string;
    /**
     * Is personal or business account.
     * @type {boolean}
     * @memberof BankAccountResponse
     */
    isPersonal: boolean;
    /**
     * Bank account number.
     * @type {string}
     * @memberof BankAccountResponse
     */
    accountNumber?: string;
    /**
     * Routing number.
     * @type {string}
     * @memberof BankAccountResponse
     */
    routingNumber?: string;
    /**
     * Additional information about bank account with country-specific data.
     * @type {string}
     * @memberof BankAccountResponse
     */
    additionalInfo?: string;
    /**
     * 3 letter ISO code for fiat currency.
     * @type {string}
     * @memberof BankAccountResponse
     */
    fiatCurrencyCode: string;
    /**
     * International details.
     * @type {Array<InternationalDetailsObject>}
     * @memberof BankAccountResponse
     */
    internationalDetails?: Array<InternationalDetailsObject>;
}
/**
 * 
 * @export
 * @interface BankObject
 */
export interface BankObject {
    /**
     * Bank name.
     * @type {string}
     * @memberof BankObject
     */
    bankName: string;
    /**
     * Bank uuid.
     * @type {string}
     * @memberof BankObject
     */
    bankUuid: string;
}
/**
 * 
 * @export
 * @interface BankaccountUpdateBody
 */
export interface BankaccountUpdateBody extends RequestBodyBankAccountId {
    /**
     * IBAN.
     * @type {string}
     * @memberof BankaccountUpdateBody
     */
    iban?: string;
    /**
     * IFSC.
     * @type {string}
     * @memberof BankaccountUpdateBody
     */
    ifsc?: string;
    /**
     * Clabe.
     * @type {string}
     * @memberof BankaccountUpdateBody
     */
    clabe?: string;
    /**
     * Bank name.
     * @type {string}
     * @memberof BankaccountUpdateBody
     */
    bankName?: string;
    /**
     * Bank ID.
     * @type {string}
     * @memberof BankaccountUpdateBody
     */
    bankUuid?: string;
    /**
     * Swift code.
     * @type {string}
     * @memberof BankaccountUpdateBody
     */
    swiftCode?: string;
    /**
     * ISO country code of the offer owner.
     * @type {string}
     * @memberof BankaccountUpdateBody
     */
    countryIso: string;
    /**
     * Holder name.
     * @type {string}
     * @memberof BankaccountUpdateBody
     */
    holderName: string;
    /**
     * Is personal or business account.
     * @type {boolean}
     * @memberof BankaccountUpdateBody
     */
    isPersonal: boolean;
    /**
     * Bank account number.
     * @type {string}
     * @memberof BankaccountUpdateBody
     */
    accountNumber?: string;
    /**
     * Routing number.
     * @type {string}
     * @memberof BankaccountUpdateBody
     */
    routingNumber?: string;
    /**
     * Additional information about bank account with country-specific data.
     * @type {string}
     * @memberof BankaccountUpdateBody
     */
    additionalInfo?: string;
    /**
     * 3 letter ISO code for fiat currency.
     * @type {string}
     * @memberof BankaccountUpdateBody
     */
    fiatCurrencyCode: string;
    /**
     * International details.
     * @type {Array<InternationalDetailsObject>}
     * @memberof BankaccountUpdateBody
     */
    internationalDetails?: Array<InternationalDetailsObject>;
}
/**
 * 
 * @export
 * @interface CountResponse
 */
export interface CountResponse {
    /**
     * Number of turned on/off offers.
     * @type {number}
     * @memberof CountResponse
     */
    count?: number;
}
/**
 * 
 * @export
 * @interface CryptoListResponse
 */
export interface CryptoListResponse {
    /**
     * 3 letter ISO code for cryptocurrency, e.g. BTC.
     * @type {string}
     * @memberof CryptoListResponse
     */
    code?: string;
    /**
     * Cryptocurrency name.
     * @type {string}
     * @memberof CryptoListResponse
     */
    name?: string;
    /**
     * Smallest unit name.
     * @type {string}
     * @memberof CryptoListResponse
     */
    smallestUnitName?: string;
}
/**
 * 
 * @export
 * @interface CurrencyBtcResponse
 */
export interface CurrencyBtcResponse {
    /**
     * Market BTC price in USD.
     * @type {number}
     * @memberof CurrencyBtcResponse
     */
    price?: number;
    /**
     * Currently only USD is supported, so this field value is always going to be USD.
     * @type {string}
     * @memberof CurrencyBtcResponse
     */
    currency?: string;
}
/**
 * 
 * @export
 * @interface CurrencyList
 */
export interface CurrencyList {
    /**
     * 3 letter ISO code for fiat currency, e.g. USD.
     * @type {string}
     * @memberof CurrencyList
     */
    code?: string;
    /**
     * Name of the fiat currency, e.g. 'US Dollar'.
     * @type {string}
     * @memberof CurrencyList
     */
    name?: string;
    /**
     * 
     * @type {CurrencyListRate}
     * @memberof CurrencyList
     */
    rate?: CurrencyListRate;
    /**
     * Localized currency name (depends on the 'locale' parameter value).
     * @type {string}
     * @memberof CurrencyList
     */
    nameLocalized?: string;
    /**
     * Minimum trade amount in USD.
     * @type {number}
     * @memberof CurrencyList
     */
    minTradeAmountUsd?: number;
}
/**
 * Rates for some currencies
 * @export
 * @interface CurrencyListRate
 */
export interface CurrencyListRate {
    /**
     * Exchange rate of one BTC to the given fiat currency.
     * @type {number}
     * @memberof CurrencyListRate
     */
    btc?: number;
    /**
     * Exchange rate of one ETH to the given fiat currency.
     * @type {number}
     * @memberof CurrencyListRate
     */
    eth?: number;
    /**
     * Exchange rate of one USD to the given fiat currency.
     * @type {number}
     * @memberof CurrencyListRate
     */
    usd?: number;
    /**
     * Exchange rate of one USDT to the given fiat currency.
     * @type {number}
     * @memberof CurrencyListRate
     */
    usdt?: number;
}
/**
 * 
 * @export
 * @interface CurrencyListResponse
 */
export interface CurrencyListResponse {
    /**
     * Number of returned currencies.
     * @type {number}
     * @memberof CurrencyListResponse
     */
    count?: number;
    /**
     * Array of the currencies.
     * @type {Array<CurrencyList>}
     * @memberof CurrencyListResponse
     */
    currencies?: Array<CurrencyList>;
}
/**
 * 
 * @export
 * @interface CurrencyRates
 */
export interface CurrencyRates {
    /**
     * 3 letter ISO code for fiat currency, e.g. USD.
     * @type {string}
     * @memberof CurrencyRates
     */
    code?: string;
    /**
     * Name of the fiat currency, e.g. 'US Dollar'.
     * @type {string}
     * @memberof CurrencyRates
     */
    name?: string;
    /**
     * Market rate of BTC to fiat currency in Satoshi.
     * @type {number}
     * @memberof CurrencyRates
     */
    rateBTC?: number;
    /**
     * Rate USD to fiat currency.
     * @type {number}
     * @memberof CurrencyRates
     */
    rateUSD?: number;
    /**
     * Minimum trade amount in USD.
     * @type {number}
     * @memberof CurrencyRates
     */
    minTradeAmountUsd?: number;
}
/**
 * 
 * @export
 * @interface CurrencyRatesResponse
 */
export interface CurrencyRatesResponse {
    /**
     * Array of rates data including rates in USD and BTC
     * @type {Array<CurrencyRates>}
     * @memberof CurrencyRatesResponse
     */
    data?: Array<CurrencyRates>;
    /**
     * Will have value 'success' if the request is successful, otherwise - 'error'.
     * @type {string}
     * @memberof CurrencyRatesResponse
     */
    status?: string;
    /**
     * Timestamp when request has been received and acknowledged by the server.
     * @type {number}
     * @memberof CurrencyRatesResponse
     */
    timestamp?: number;
}
/**
 * 
 * @export
 * @interface ErrorResponse
 */
export interface ErrorResponse {
    /**
     * 
     * @type {ErrorResponseData}
     * @memberof ErrorResponse
     */
    data?: ErrorResponseData;
    /**
     * Will have value 'success' if the request is successful, otherwise - 'error'.
     * @type {string}
     * @memberof ErrorResponse
     */
    status?: string;
    /**
     * Timestamp when request has been received and acknowledged by the server.
     * @type {number}
     * @memberof ErrorResponse
     */
    timestamp?: number;
}
/**
 * 
 * @export
 * @interface ErrorResponseData
 */
export interface ErrorResponseData {
    /**
     * Code of the error.
     * @type {number}
     * @memberof ErrorResponseData
     */
    code?: number;
    /**
     * Message of the error.
     * @type {string}
     * @memberof ErrorResponseData
     */
    message?: string;
}
/**
 * 
 * @export
 * @interface FeedbackList
 */
export interface FeedbackList {
    /**
     * Feedback rating. Possible values: 1(positive), -1(negative).
     * @type {number}
     * @memberof FeedbackList
     */
    rating?: number;
    /**
     * Feedback message.
     * @type {string}
     * @memberof FeedbackList
     */
    message?: string;
    /**
     * Datetime when feedback was created.
     * @type {string}
     * @memberof FeedbackList
     */
    createdAt?: string;
    /**
     * A hash (ID) of an offer.
     * @type {string}
     * @memberof FeedbackList
     */
    offerHash?: string;
    /**
     * A hash (ID) of the trade.
     * @type {string}
     * @memberof FeedbackList
     */
    tradeHash?: string;
    /**
     * A unique identifier of a feedback author.
     * @type {string}
     * @memberof FeedbackList
     */
    authorUuid?: string;
    /**
     * A unique identifier of a feedback reciever.
     * @type {string}
     * @memberof FeedbackList
     */
    receiverUuid?: string;
    /**
     * Replied message from receiver.
     * @type {string}
     * @memberof FeedbackList
     */
    replyMessage?: string;
    /**
     * Author username of feedback.
     * @type {string}
     * @memberof FeedbackList
     */
    authorUsername?: string;
    /**
     * Reciever username of feedback.
     * @type {string}
     * @memberof FeedbackList
     */
    receiverUsername?: string;
}
/**
 * 
 * @export
 * @interface FeedbackListResponse
 */
export interface FeedbackListResponse {
    /**
     * Current page.
     * @type {number}
     * @memberof FeedbackListResponse
     */
    page?: number;
    /**
     * A number of returned feedback at current page.
     * @type {number}
     * @memberof FeedbackListResponse
     */
    count?: number;
    /**
     * A max number of feedback returned per page.
     * @type {number}
     * @memberof FeedbackListResponse
     */
    limit?: number;
    /**
     * Array of the feedback.
     * @type {Array<FeedbackList>}
     * @memberof FeedbackListResponse
     */
    feedback?: Array<FeedbackList>;
    /**
     * Total number of feedback for a given user or offer.
     * @type {number}
     * @memberof FeedbackListResponse
     */
    totalCount?: number;
}
/**
 * 
 * @export
 * @interface InlineResponse200
 */
export interface InlineResponse200 extends SuccessResponse {
    /**
     * 
     * @type {UserMeObject}
     * @memberof InlineResponse200
     */
    data?: UserMeObject;
}
/**
 * 
 * @export
 * @interface InlineResponse2001
 */
export interface InlineResponse2001 extends SuccessResponse {
    /**
     * 
     * @type {Array<BankObject>}
     * @memberof InlineResponse2001
     */
    data?: Array<BankObject>;
}
/**
 * 
 * @export
 * @interface InlineResponse20010
 */
export interface InlineResponse20010 extends SuccessResponse {
    /**
     * 
     * @type {OfferPriceResponse}
     * @memberof InlineResponse20010
     */
    data?: OfferPriceResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse20011
 */
export interface InlineResponse20011 extends SuccessResponse {
    /**
     * 
     * @type {TradeStartResponse}
     * @memberof InlineResponse20011
     */
    data?: TradeStartResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse20012
 */
export interface InlineResponse20012 extends SuccessResponse {
    /**
     * 
     * @type {OfferCreateResponse}
     * @memberof InlineResponse20012
     */
    data?: OfferCreateResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse20013
 */
export interface InlineResponse20013 extends SuccessResponse {
    /**
     * 
     * @type {OfferPricesResponse}
     * @memberof InlineResponse20013
     */
    data?: OfferPricesResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse20014
 */
export interface InlineResponse20014 extends SuccessResponse {
    /**
     * 
     * @type {CurrencyListResponse}
     * @memberof InlineResponse20014
     */
    data?: CurrencyListResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse20015
 */
export interface InlineResponse20015 extends SuccessResponse {
    /**
     * 
     * @type {FeedbackListResponse}
     * @memberof InlineResponse20015
     */
    data?: FeedbackListResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse20016
 */
export interface InlineResponse20016 extends SuccessResponse {
    /**
     * 
     * @type {CountResponse}
     * @memberof InlineResponse20016
     */
    data?: CountResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse20017
 */
export interface InlineResponse20017 extends SuccessResponse {
    /**
     * 
     * @type {OfferTagListResponse}
     * @memberof InlineResponse20017
     */
    data?: OfferTagListResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse20018
 */
export interface InlineResponse20018 extends SuccessResponse {
    /**
     * 
     * @type {TradeChatGetResponse}
     * @memberof InlineResponse20018
     */
    data?: TradeChatGetResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse20019
 */
export interface InlineResponse20019 extends SuccessResponse {
    /**
     * 
     * @type {UserAffiliateResponse}
     * @memberof InlineResponse20019
     */
    data?: UserAffiliateResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse2002
 */
export interface InlineResponse2002 extends SuccessResponse {
    /**
     * 
     * @type {OfferAllResponse}
     * @memberof InlineResponse2002
     */
    data?: OfferAllResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse20020
 */
export interface InlineResponse20020 extends SuccessResponse {
    /**
     * 
     * @type {WalletBalanceResponse}
     * @memberof InlineResponse20020
     */
    data?: WalletBalanceResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse20021
 */
export interface InlineResponse20021 extends SuccessResponse {
    /**
     * 
     * @type {WalletConvertResponse}
     * @memberof InlineResponse20021
     */
    data?: WalletConvertResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse20022
 */
export interface InlineResponse20022 extends SuccessResponse {
    /**
     * 
     * @type {TradeChatAddResponse}
     * @memberof InlineResponse20022
     */
    data?: TradeChatAddResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse20023
 */
export interface InlineResponse20023 extends SuccessResponse {
    /**
     * 
     * @type {TradeCompletedResponse}
     * @memberof InlineResponse20023
     */
    data?: TradeCompletedResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse20024
 */
export interface InlineResponse20024 extends SuccessResponse {
    /**
     * 
     * @type {TradeLocationsResponse}
     * @memberof InlineResponse20024
     */
    data?: TradeLocationsResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse20025
 */
export interface InlineResponse20025 extends SuccessResponse {
    /**
     * 
     * @type {BankAccountGetResponse}
     * @memberof InlineResponse20025
     */
    data?: BankAccountGetResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse20026
 */
export interface InlineResponse20026 extends SuccessResponse {
    /**
     * 
     * @type {TransactionsAllResponse}
     * @memberof InlineResponse20026
     */
    data?: TransactionsAllResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse20027
 */
export interface InlineResponse20027 extends SuccessResponse {
    /**
     * 
     * @type {Array<BankAccountResponse>}
     * @memberof InlineResponse20027
     */
    data?: Array<BankAccountResponse>;
}
/**
 * 
 * @export
 * @interface InlineResponse20028
 */
export interface InlineResponse20028 extends SuccessResponse {
    /**
     * 
     * @type {TradeChatLatestResponse}
     * @memberof InlineResponse20028
     */
    data?: TradeChatLatestResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse20029
 */
export interface InlineResponse20029 extends SuccessResponse {
    /**
     * 
     * @type {UserBlockedListResponse}
     * @memberof InlineResponse20029
     */
    data?: UserBlockedListResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse2003
 */
export interface InlineResponse2003 extends SuccessResponse {
    /**
     * 
     * @type {OfferGetResponse}
     * @memberof InlineResponse2003
     */
    data?: OfferGetResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse20030
 */
export interface InlineResponse20030 extends SuccessResponse {
    /**
     * 
     * @type {AffiliateTransactionsResponse}
     * @memberof InlineResponse20030
     */
    data?: AffiliateTransactionsResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse20031
 */
export interface InlineResponse20031 extends SuccessResponse {
    /**
     * 
     * @type {NotificationsListResponse}
     * @memberof InlineResponse20031
     */
    data?: NotificationsListResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse20032
 */
export interface InlineResponse20032 extends SuccessResponse {
    /**
     * 
     * @type {PaymentMethodFeeResponse}
     * @memberof InlineResponse20032
     */
    data?: PaymentMethodFeeResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse20033
 */
export interface InlineResponse20033 extends SuccessResponse {
    /**
     * 
     * @type {WalletNewAddressResponse}
     * @memberof InlineResponse20033
     */
    data?: WalletNewAddressResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse20034
 */
export interface InlineResponse20034 extends SuccessResponse {
    /**
     * 
     * @type {BankAccountResponse}
     * @memberof InlineResponse20034
     */
    data?: BankAccountResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse20035
 */
export interface InlineResponse20035 extends SuccessResponse {
    /**
     * 
     * @type {TradeDisputeReasonsResponse}
     * @memberof InlineResponse20035
     */
    data?: TradeDisputeReasonsResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse20036
 */
export interface InlineResponse20036 extends SuccessResponse {
    /**
     * 
     * @type {WalletListAddressesResponse}
     * @memberof InlineResponse20036
     */
    data?: WalletListAddressesResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse20037
 */
export interface InlineResponse20037 extends SuccessResponse {
    /**
     * 
     * @type {WalletConversionQuotesResponse}
     * @memberof InlineResponse20037
     */
    data?: WalletConversionQuotesResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse20038
 */
export interface InlineResponse20038 extends SuccessResponse {
    /**
     * 
     * @type {NotificationsUnreadCountResponse}
     * @memberof InlineResponse20038
     */
    data?: NotificationsUnreadCountResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse2004
 */
export interface InlineResponse2004 extends SuccessResponse {
    /**
     * 
     * @type {TradeGetResponse}
     * @memberof InlineResponse2004
     */
    data?: TradeGetResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse2005
 */
export interface InlineResponse2005 extends SuccessResponse {
    /**
     * 
     * @type {UserInfoObject}
     * @memberof InlineResponse2005
     */
    data?: UserInfoObject;
}
/**
 * 
 * @export
 * @interface InlineResponse2006
 */
export interface InlineResponse2006 extends SuccessResponse {
    /**
     * 
     * @type {OfferListResponse}
     * @memberof InlineResponse2006
     */
    data?: OfferListResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse2007
 */
export interface InlineResponse2007 extends SuccessResponse {
    /**
     * 
     * @type {TradeListResponse}
     * @memberof InlineResponse2007
     */
    data?: TradeListResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse2008
 */
export interface InlineResponse2008 extends SuccessResponse {
    /**
     * 
     * @type {UserTypesResponse}
     * @memberof InlineResponse2008
     */
    data?: UserTypesResponse;
}
/**
 * 
 * @export
 * @interface InlineResponse2009
 */
export interface InlineResponse2009 extends SuccessResponse {
    /**
     * 
     * @type {Array<CryptoListResponse>}
     * @memberof InlineResponse2009
     */
    data?: Array<CryptoListResponse>;
}
/**
 * 
 * @export
 * @interface InlineResponse400
 */
export interface InlineResponse400 extends ErrorResponse {
    /**
     * 
     * @type {any}
     * @memberof InlineResponse400
     */
    data?: any;
}
/**
 * 
 * @export
 * @interface InlineResponse4001
 */
export interface InlineResponse4001 extends ErrorResponse {
    /**
     * 
     * @type {any}
     * @memberof InlineResponse4001
     */
    data?: any;
}
/**
 * 
 * @export
 * @interface InlineResponse40010
 */
export interface InlineResponse40010 extends ErrorResponse {
    /**
     * 
     * @type {InlineResponse40010Data}
     * @memberof InlineResponse40010
     */
    data?: InlineResponse40010Data;
}
/**
 * 
 * @export
 * @interface InlineResponse40010Data
 */
export interface InlineResponse40010Data {
    /**
     * 
     * @type {number}
     * @memberof InlineResponse40010Data
     */
    code?: number;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse40010Data
     */
    message?: string;
}
/**
 * 
 * @export
 * @interface InlineResponse40011
 */
export interface InlineResponse40011 extends ErrorResponse {
    /**
     * Fetch messages for all active trade
     * @type {any}
     * @memberof InlineResponse40011
     */
    data?: any;
}
/**
 * 
 * @export
 * @interface InlineResponse40012
 */
export interface InlineResponse40012 extends ErrorResponse {
    /**
     * 
     * @type {any}
     * @memberof InlineResponse40012
     */
    data?: any;
}
/**
 * 
 * @export
 * @interface InlineResponse40013
 */
export interface InlineResponse40013 extends ErrorResponse {
    /**
     * 
     * @type {any}
     * @memberof InlineResponse40013
     */
    data?: any;
}
/**
 * 
 * @export
 * @interface InlineResponse40014
 */
export interface InlineResponse40014 extends ErrorResponse {
    /**
     * 
     * @type {any}
     * @memberof InlineResponse40014
     */
    data?: any;
}
/**
 * 
 * @export
 * @interface InlineResponse40015
 */
export interface InlineResponse40015 extends ErrorResponse {
    /**
     * 
     * @type {any}
     * @memberof InlineResponse40015
     */
    data?: any;
}
/**
 * 
 * @export
 * @interface InlineResponse4002
 */
export interface InlineResponse4002 extends ErrorResponse {
    /**
     * 
     * @type {any}
     * @memberof InlineResponse4002
     */
    data?: any;
}
/**
 * 
 * @export
 * @interface InlineResponse4003
 */
export interface InlineResponse4003 extends SuccessTrueResponse {
    /**
     * 
     * @type {any}
     * @memberof InlineResponse4003
     */
    data?: any;
}
/**
 * 
 * @export
 * @interface InlineResponse4004
 */
export interface InlineResponse4004 extends ErrorResponse {
    /**
     * Fetch messages for a trade
     * @type {any}
     * @memberof InlineResponse4004
     */
    data?: any;
}
/**
 * 
 * @export
 * @interface InlineResponse4005
 */
export interface InlineResponse4005 extends ErrorResponse {
    /**
     * 
     * @type {any}
     * @memberof InlineResponse4005
     */
    data?: any;
}
/**
 * 
 * @export
 * @interface InlineResponse4006
 */
export interface InlineResponse4006 extends ErrorResponse {
    /**
     * 
     * @type {any}
     * @memberof InlineResponse4006
     */
    data?: any;
}
/**
 * 
 * @export
 * @interface InlineResponse4007
 */
export interface InlineResponse4007 extends ErrorResponse {
    /**
     * Post a post!
     * @type {any}
     * @memberof InlineResponse4007
     */
    data?: any;
}
/**
 * 
 * @export
 * @interface InlineResponse4008
 */
export interface InlineResponse4008 extends ErrorResponse {
    /**
     * 
     * @type {any}
     * @memberof InlineResponse4008
     */
    data?: any;
}
/**
 * 
 * @export
 * @interface InlineResponse4009
 */
export interface InlineResponse4009 extends ErrorResponse {
    /**
     * 
     * @type {any}
     * @memberof InlineResponse4009
     */
    data?: any;
}
/**
 * 
 * @export
 * @interface InlineResponse404
 */
export interface InlineResponse404 extends ErrorResponse {
    /**
     * 
     * @type {any}
     * @memberof InlineResponse404
     */
    data?: any;
}
/**
 * 
 * @export
 * @interface InlineResponse4041
 */
export interface InlineResponse4041 extends ErrorResponse {
    /**
     * Fetch price for an offer
     * @type {any}
     * @memberof InlineResponse4041
     */
    data?: any;
}
/**
 * 
 * @export
 * @interface InlineResponse4042
 */
export interface InlineResponse4042 extends ErrorResponse {
    /**
     * Method handles removal of offers
     * @type {any}
     * @memberof InlineResponse4042
     */
    data?: any;
}
/**
 * 
 * @export
 * @interface InlineResponse4043
 */
export interface InlineResponse4043 extends ErrorResponse {
    /**
     * Method handling the Update of offers
     * @type {any}
     * @memberof InlineResponse4043
     */
    data?: any;
}
/**
 * 
 * @export
 * @interface InlineResponse4044
 */
export interface InlineResponse4044 extends ErrorResponse {
    /**
     * 
     * @type {any}
     * @memberof InlineResponse4044
     */
    data?: any;
}
/**
 * 
 * @export
 * @interface InlineResponse422
 */
export interface InlineResponse422 extends ErrorResponse {
    /**
     * 
     * @type {any}
     * @memberof InlineResponse422
     */
    data?: any;
}
/**
 * 
 * @export
 * @interface InlineResponse500
 */
export interface InlineResponse500 extends ErrorResponse {
    /**
     * 
     * @type {any}
     * @memberof InlineResponse500
     */
    data?: any;
}
/**
 * 
 * @export
 * @interface InlineResponse501
 */
export interface InlineResponse501 extends ErrorResponse {
    /**
     * 
     * @type {any}
     * @memberof InlineResponse501
     */
    data?: any;
}
/**
 * 
 * @export
 * @interface InternationalDetailsObject
 */
export interface InternationalDetailsObject {
    /**
     * Zip.
     * @type {string}
     * @memberof InternationalDetailsObject
     */
    zip?: string;
    /**
     * City.
     * @type {string}
     * @memberof InternationalDetailsObject
     */
    city?: string;
    /**
     * State.
     * @type {string}
     * @memberof InternationalDetailsObject
     */
    state?: string;
    /**
     * Address.
     * @type {string}
     * @memberof InternationalDetailsObject
     */
    address?: string;
    /**
     * Residency.
     * @type {string}
     * @memberof InternationalDetailsObject
     */
    residency?: string;
}
/**
 * 
 * @export
 * @interface NotificationsList
 */
export interface NotificationsList {
    /**
     * Unique ID of notification.
     * @type {string}
     * @memberof NotificationsList
     */
    id?: string;
    /**
     * Link to the page associated with the event.
     * @type {string}
     * @memberof NotificationsList
     */
    link?: string;
    /**
     * Notification text.
     * @type {string}
     * @memberof NotificationsList
     */
    message?: string;
    /**
     * When notification was read. If notification has not been read yet, then NULL will be returned.
     * @type {number}
     * @memberof NotificationsList
     */
    readAt?: number;
    /**
     * More detailed information about notification. Rarely used feature. You can see samples of how 'subtext' looks like by navigating to https://paxful.com/account/notifications?tab=inbox.
     * @type {string}
     * @memberof NotificationsList
     */
    subtext?: string;
    /**
     * Full link to the page associated with the event.
     * @type {string}
     * @memberof NotificationsList
     */
    fullLink?: string;
    /**
     * Timestamp of when a notification has been created.
     * @type {number}
     * @memberof NotificationsList
     */
    timestamp?: number;
    /**
     * Technical ID of notification type. You can use it to decide how to render a notification content depending on its type.
     * @type {string}
     * @memberof NotificationsList
     */
    messageType?: string;
    /**
     * If a notification of the same type has been received multiple times (a new trade chat message, for example), then no new notifications are created but instead this field's value is incremented.
     * @type {number}
     * @memberof NotificationsList
     */
    uncheckCount?: number;
}
/**
 * 
 * @export
 * @interface NotificationsListResponse
 */
export interface NotificationsListResponse {
    /**
     * Current page.
     * @type {number}
     * @memberof NotificationsListResponse
     */
    page?: number;
    /**
     * Number of returned notifications.
     * @type {number}
     * @memberof NotificationsListResponse
     */
    count?: number;
    /**
     * Maximum number of notifications that can be returned per page.
     * @type {number}
     * @memberof NotificationsListResponse
     */
    limit?: number;
    /**
     * A total number of available notifications (on all pages).
     * @type {number}
     * @memberof NotificationsListResponse
     */
    totalCount?: number;
    /**
     * Array of notifications objects.
     * @type {Array<NotificationsList>}
     * @memberof NotificationsListResponse
     */
    notifications?: Array<NotificationsList>;
}
/**
 * 
 * @export
 * @interface NotificationsUnreadCountResponse
 */
export interface NotificationsUnreadCountResponse {
    /**
     * Number of unread notifications.
     * @type {number}
     * @memberof NotificationsUnreadCountResponse
     */
    count?: number;
}
/**
 * 
 * @export
 * @interface OfferAllObject
 */
export interface OfferAllObject {
    /**
     * Array of tags objects.
     * @type {Array<OfferTagsObject>}
     * @memberof OfferAllObject
     */
    tags?: Array<OfferTagsObject>;
    /**
     * If TRUE then offer is going to be available for trading.
     * @type {boolean}
     * @memberof OfferAllObject
     */
    active?: boolean;
    /**
     * A percent that determines differences between market price and the price of the offer.
     * @type {number}
     * @memberof OfferAllObject
     */
    margin?: number;
    /**
     * A hash (ID) of the offer.
     * @type {string}
     * @memberof OfferAllObject
     */
    offerId?: string;
    /**
     * For some specific payment methods (gold, cash in person), offer owner should add his location, where he is able to conduct business.
     * @type {string}
     * @memberof OfferAllObject
     */
    cityName?: string;
    /**
     * How much time ago the offer owner has been seen last time, e.g seen-long-ago.
     * @type {string}
     * @memberof OfferAllObject
     */
    lastSeen?: OfferAllObject.LastSeenEnum;
    /**
     * A maximum value of the trade limit, i.e the largest amount of crypto currency that a trade can be started with.
     * @type {number}
     * @memberof OfferAllObject
     */
    cryptoMax?: number;
    /**
     * A minimum value of the trade limit, i.e the smallest amount of crypto currency that a trade can be started with.
     * @type {number}
     * @memberof OfferAllObject
     */
    cryptoMin?: number;
    /**
     * An array of intervals when the offer is active for the week.
     * @type {Array<OfferDutyHours>}
     * @memberof OfferAllObject
     */
    dutyHours?: Array<OfferDutyHours>;
    /**
     * Deprecated field. Please use location_id.
     * @type {number}
     * @memberof OfferAllObject
     */
    geonameId?: number;
    /**
     * Will return TRUE if this offer belongs to a user that you have blocked.
     * @type {boolean}
     * @memberof OfferAllObject
     */
    isBlocked?: boolean;
    /**
     * A link to the offer.
     * @type {string}
     * @memberof OfferAllObject
     */
    offerLink?: string;
    /**
     * An offer type. Possible values: 'buy', 'sell'.
     * @type {string}
     * @memberof OfferAllObject
     */
    offerType?: OfferAllObject.OfferTypeEnum;
    /**
     * Deprecated. Fee percentage of the offer.
     * @type {string}
     * @memberof OfferAllObject
     */
    sellerFee?: string;
    /**
     * If this field is TRUE, then a given offer matches 'user_country' filter (or user's automatically detected country if filter is omitted). If this field is FALSE, it means that we were not able to find a perfect match against 'user_country' and instead return a next best thing that user might be interested in.
     * @type {boolean}
     * @memberof OfferAllObject
     */
    isFeatured?: boolean;
    /**
     * Location ID is needed to search for offers with specific payment methods, e.g. Cash in Person, Gold. You can find location IDs here: https://www.geonames.org/.
     * @type {number}
     * @memberof OfferAllObject
     */
    locationId?: number;
    /**
     * Terms of the offer for a trade partner.
     * @type {string}
     * @memberof OfferAllObject
     */
    offerTerms?: string;
    /**
     * Country name of the offer owner.
     * @type {string}
     * @memberof OfferAllObject
     */
    countryName?: string;
    /**
     * Deprecated. Use 'fiat_currency_code' instead. 3 letter ISO code for fiat currency, e.g 'USD'.
     * @type {string}
     * @memberof OfferAllObject
     */
    currencyCode?: string;
    /**
     * Commission that is charged by Paxful to conduct trades with this offer.
     * @type {number}
     * @memberof OfferAllObject
     */
    feePercentage?: number;
    /**
     * How much time the trade partner has to make the payment and click \"Paid\" before the trade is automatically canceled.
     * @type {number}
     * @memberof OfferAllObject
     */
    paymentWindow?: number;
    /**
     * ISO 3166 country subdivision name.
     * @type {string}
     * @memberof OfferAllObject
     */
    subdivisionName?: string;
    /**
     * 3 letter ISO code for fiat currency, e.g 'USD'.
     * @type {string}
     * @memberof OfferAllObject
     */
    fiatCurrencyCode?: string;
    /**
     * Deprecated. Use 'fiat_price_per_crypto' and 'crypto_currency_code'. Fiat price of the offer per BTC.
     * @type {number}
     * @memberof OfferAllObject
     */
    fiatPricePerBtc?: number;
    /**
     * A timestamp when the owner of the offer was last seen.
     * @type {number}
     * @memberof OfferAllObject
     */
    lastSeenTimestamp?: number;
    /**
     * A name of the payment method.
     * @type {string}
     * @memberof OfferAllObject
     */
    paymentMethodName?: string;
    /**
     * A slug of the payment method.
     * @type {string}
     * @memberof OfferAllObject
     */
    paymentMethodSlug?: string;
    /**
     * Will be TRUE if offer requires a trade partner to have verified their ID.
     * @type {boolean}
     * @memberof OfferAllObject
     */
    requireVerifiedId?: boolean;
    /**
     * Code of the crypto currency.
     * @type {string}
     * @memberof OfferAllObject
     */
    cryptoCurrencyCode?: string;
    /**
     * A username of the offer owner.
     * @type {string}
     * @memberof OfferAllObject
     */
    offerOwnerUsername?: string;
    /**
     * A group of payment methods.
     * @type {string}
     * @memberof OfferAllObject
     */
    paymentMethodGroup?: string;
    /**
     * A bank name, that appears after the payment method.
     * @type {string}
     * @memberof OfferAllObject
     */
    paymentMethodLabel?: string;
    /**
     * A maximum value of the trade limit, i.e the largest amount of fiat currency that a trade can be started with.
     * @type {number}
     * @memberof OfferAllObject
     */
    fiatAmountRangeMax?: number;
    /**
     * A minimum value of the trade limit, i.e the smallest amount of fiat currency that a trade can be started with.
     * @type {number}
     * @memberof OfferAllObject
     */
    fiatAmountRangeMin?: number;
    /**
     * Fiat price of the offer per crypto.
     * @type {number}
     * @memberof OfferAllObject
     */
    fiatPricePerCrypto?: number;
    /**
     * Deprecated. Use 'fiat_usd_price_per_crypto'. Fiat USD price of the offer per crypto.
     * @type {number}
     * @memberof OfferAllObject
     */
    fiatUSDPricePerBtc?: number;
    /**
     * Will be TRUE if a trade partner is required to have their email verified.
     * @type {boolean}
     * @memberof OfferAllObject
     */
    requireVerifiedEmail?: boolean;
    /**
     * Will be TRUE if a trade partner is required to have their phone verified.
     * @type {boolean}
     * @memberof OfferAllObject
     */
    requireVerifiedPhone?: boolean;
    /**
     * ISO country code of the offer owner.
     * @type {string}
     * @memberof OfferAllObject
     */
    offerOwnerCountryIso?: string;
    /**
     * The offer can be shown only to users with a given amount of past trades.
     * @type {string}
     * @memberof OfferAllObject
     */
    requireMinPastTrades?: string;
    /**
     * A link to the profile of the offer owner.
     * @type {string}
     * @memberof OfferAllObject
     */
    offerOwnerProfileLink?: string;
    /**
     * Fiat USD price of the offer per crypto.
     * @type {number}
     * @memberof OfferAllObject
     */
    fiatUsdPricePerCrypto?: number;
    /**
     * A number of the negative feedback of the offer owner.
     * @type {number}
     * @memberof OfferAllObject
     */
    offerOwnerFeedbackNegative?: number;
    /**
     * A number of the positive feedback of the offer owner.
     * @type {number}
     * @memberof OfferAllObject
     */
    offerOwnerFeedbackPositive?: number;
}

/**
 * @export
 * @namespace OfferAllObject
 */
export namespace OfferAllObject {
    /**
     * @export
     * @enum {string}
     */
    export enum LastSeenEnum {
        LastSeen = <any> 'last-seen',
        SeenLongAgo = <any> 'seen-long-ago',
        SeenRecently = <any> 'seen-recently',
        SeenVeryRecently = <any> 'seen-very-recently'
    }
    /**
     * @export
     * @enum {string}
     */
    export enum OfferTypeEnum {
        Sell = <any> 'sell',
        Buy = <any> 'buy'
    }
}
/**
 * 
 * @export
 * @interface OfferAllResponse
 */
export interface OfferAllResponse {
    /**
     * Number of returned offers.
     * @type {number}
     * @memberof OfferAllResponse
     */
    count?: number;
    /**
     * Limit count of result.
     * @type {number}
     * @memberof OfferAllResponse
     */
    limit?: number;
    /**
     * Array of offers objects.
     * @type {Array<OfferAllObject>}
     * @memberof OfferAllResponse
     */
    offers?: Array<OfferAllObject>;
    /**
     * An offset for a result.
     * @type {number}
     * @memberof OfferAllResponse
     */
    offset?: number;
    /**
     * Total number of existing offers.
     * @type {number}
     * @memberof OfferAllResponse
     */
    totalCount?: number;
}
/**
 * 
 * @export
 * @interface OfferCreateResponse
 */
export interface OfferCreateResponse {
    /**
     * Deprecated. See 'status' field. True or false, whether the offer was created.
     * @type {boolean}
     * @memberof OfferCreateResponse
     */
    success?: boolean;
    /**
     * A hash (ID) of the offer.
     * @type {string}
     * @memberof OfferCreateResponse
     */
    offerHash?: string;
}
/**
 * 
 * @export
 * @interface OfferDutyHours
 */
export interface OfferDutyHours {
    /**
     * A day of the week. Possible values: 1 - Monday, 2 - Tuesday, 3 - Wednesday, 4 - Thursday, 5 - Friday, 6 - Saturday, 7 - Sunday.
     * @type {number}
     * @memberof OfferDutyHours
     */
    day?: number;
    /**
     * Flag to activate duty hours.
     * @type {boolean}
     * @memberof OfferDutyHours
     */
    active?: boolean;
    /**
     * Time until the offer is active, e.g 22:15.
     * @type {string}
     * @memberof OfferDutyHours
     */
    endTime?: string;
    /**
     * Time from the offer is active, e.g 19:30.
     * @type {string}
     * @memberof OfferDutyHours
     */
    startTime?: string;
}
/**
 * 
 * @export
 * @interface OfferGetResponse
 */
export interface OfferGetResponse extends OfferObject {
    /**
     * Instructions for a trade partner.
     * @type {string}
     * @memberof OfferGetResponse
     */
    tradeDetails?: string;
}

/**
 * @export
 * @namespace OfferGetResponse
 */
export namespace OfferGetResponse {
}
/**
 * 
 * @export
 * @interface OfferListResponse
 */
export interface OfferListResponse {
    /**
     * Number of returned offers.
     * @type {number}
     * @memberof OfferListResponse
     */
    count?: number;
    /**
     * Array of offers objects.
     * @type {Array<OfferObject>}
     * @memberof OfferListResponse
     */
    offers?: Array<OfferObject>;
}
/**
 * 
 * @export
 * @interface OfferObject
 */
export interface OfferObject {
    /**
     * A hash (ID) of the offer.
     * @type {string}
     * @memberof OfferObject
     */
    id?: string;
    /**
     * Array of tags objects.
     * @type {Array<OfferTagsObject>}
     * @memberof OfferObject
     */
    tags?: Array<OfferTagsObject>;
    /**
     * If TRUE then offer is going to be available for trading.
     * @type {boolean}
     * @memberof OfferObject
     */
    active?: boolean;
    /**
     * A percent that determines differences between market price and the price of the offer.
     * @type {number}
     * @memberof OfferObject
     */
    margin?: number;
    /**
     * A hash (ID) of the offer.
     * @type {string}
     * @memberof OfferObject
     */
    offerId?: string;
    /**
     * For some specific payment methods (gold, cash in person), offer owner should add his location, where he is able to conduct business.
     * @type {string}
     * @memberof OfferObject
     */
    cityName?: string;
    /**
     * A flow type.
     * @type {string}
     * @memberof OfferObject
     */
    flowType?: OfferObject.FlowTypeEnum;
    /**
     * How much time ago the offer owner has been seen last time, e.g seen-long-ago.
     * @type {string}
     * @memberof OfferObject
     */
    lastSeen?: OfferObject.LastSeenEnum;
    /**
     * Timestamp of when the offer has been created.
     * @type {number}
     * @memberof OfferObject
     */
    createdAt?: number;
    /**
     * A maximum value of the trade limit, i.e the largest amount of crypto currency that a trade can be started with.
     * @type {number}
     * @memberof OfferObject
     */
    cryptoMax?: number;
    /**
     * A minimum value of the trade limit, i.e the smallest amount of crypto currency that a trade can be started with.
     * @type {number}
     * @memberof OfferObject
     */
    cryptoMin?: number;
    /**
     * An array of intervals when the offer is active for the week.
     * @type {Array<OfferDutyHours>}
     * @memberof OfferObject
     */
    dutyHours?: Array<OfferDutyHours>;
    /**
     * Deprecated field. Please use location_id.
     * @type {number}
     * @memberof OfferObject
     */
    geonameId?: number;
    /**
     * Will return TRUE if this offer belongs to a user that you have blocked.
     * @type {boolean}
     * @memberof OfferObject
     */
    isBlocked?: boolean;
    /**
     * A hash (ID) of the offer.
     * @type {string}
     * @memberof OfferObject
     */
    offerHash?: string;
    /**
     * A link to the offer.
     * @type {string}
     * @memberof OfferObject
     */
    offerLink?: string;
    /**
     * An offer type. Possible values: 'buy', 'sell'.
     * @type {string}
     * @memberof OfferObject
     */
    offerType?: OfferObject.OfferTypeEnum;
    /**
     * Timestamp of when the offer has been updated.
     * @type {number}
     * @memberof OfferObject
     */
    updatedAt?: number;
    /**
     * Location ID is needed to search for offers with specific payment methods, e.g. Cash in Person, Gold. You can find location IDs here: https://www.geonames.org/.
     * @type {number}
     * @memberof OfferObject
     */
    locationId?: number;
    /**
     * Terms of the offer for a trade partner.
     * @type {string}
     * @memberof OfferObject
     */
    offerTerms?: string;
    /**
     * Country name of the offer owner.
     * @type {string}
     * @memberof OfferObject
     */
    countryName?: string;
    /**
     * For SELL offer type, this will be calculated average time of the difference in minutes between buyer presses PAID and seller released coins. For BUY offer type, this will be calcuated average time of the difference in minutes between trade started and seller released coins. This value will become available after at least 3 trades have been conducted using an offer.
     * @type {number}
     * @memberof OfferObject
     */
    releaseTime?: number;
    /**
     * List of bank accounts for the offer.
     * @type {Array<BankAccountResponse>}
     * @memberof OfferObject
     */
    bankAccounts?: Array<BankAccountResponse>;
    /**
     * Deprecated. Use 'fiat_currency_code' instead. 3 letter ISO code for fiat currency, e.g 'USD'.
     * @type {string}
     * @memberof OfferObject
     */
    currencyCode?: string;
    /**
     * Commission that is charged by Paxful to conduct trades with this offer.
     * @type {number}
     * @memberof OfferObject
     */
    feePercentage?: number;
    /**
     * Will be 'true' if it's a fixed price offer.
     * @type {boolean}
     * @memberof OfferObject
     */
    isFixedPrice?: boolean;
    /**
     * How much time the trade partner has to make the payment and click 'Paid' before the trade is automatically canceled.
     * @type {number}
     * @memberof OfferObject
     */
    paymentWindow?: number;
    /**
     * Deprecated. Use 'crypto_currency_code' instead
     * @type {string}
     * @memberof OfferObject
     */
    cryptoCurrency?: string;
    /**
     * ISO 3166 country subdivision name.
     * @type {string}
     * @memberof OfferObject
     */
    subdivisionName?: string;
    /**
     * Deprecated. Comma-separated predefined amounts of fiat currency, i.e. 20,30,50 will be displayed as '{20,30,50}'.
     * @type {string}
     * @memberof OfferObject
     */
    predefinedAmount?: string;
    /**
     * 3 letter ISO code for fiat currency, e.g 'USD'.
     * @type {string}
     * @memberof OfferObject
     */
    fiatCurrencyCode?: string;
    /**
     * Deprecated. Use 'fiat_price_per_crypto' and 'crypto_currency_code'. Fiat price of the offer per BTC.
     * @type {number}
     * @memberof OfferObject
     */
    fiatPricePerBtc?: number;
    /**
     * A timestamp when the owner of the offer was last seen.
     * @type {number}
     * @memberof OfferObject
     */
    lastSeenTimestamp?: number;
    /**
     * A name of the payment method.
     * @type {string}
     * @memberof OfferObject
     */
    paymentMethodName?: string;
    /**
     * A slug of the payment method.
     * @type {string}
     * @memberof OfferObject
     */
    paymentMethodSlug?: string;
    /**
     * For SELL offer type, this will be calculated median time of the difference in minutes between buyer presses PAID and seller released coins. For BUY offer type, this will be calcuated median time of the difference in minutes between trade started and seller released coins. This value will become available after at least 3 trades have been conducted using an offer.
     * @type {string}
     * @memberof OfferObject
     */
    releaseTimeMedian?: string;
    /**
     * Will be TRUE if offer requires a trade partner to have verified their ID.
     * @type {boolean}
     * @memberof OfferObject
     */
    requireVerifiedId?: boolean;
    /**
     * Code of the crypto currency.
     * @type {string}
     * @memberof OfferObject
     */
    cryptoCurrencyCode?: string;
    /**
     * A username of the offer owner.
     * @type {string}
     * @memberof OfferObject
     */
    offerOwnerUsername?: string;
    /**
     * A group of payment methods.
     * @type {string}
     * @memberof OfferObject
     */
    paymentMethodGroup?: string;
    /**
     * A bank name, that appears after the payment method.
     * @type {string}
     * @memberof OfferObject
     */
    paymentMethodLabel?: string;
    /**
     * A maximum value of the trade limit, i.e the largest amount of fiat currency that a trade can be started with.
     * @type {number}
     * @memberof OfferObject
     */
    fiatAmountRangeMax?: number;
    /**
     * A minimum value of the trade limit, i.e the smallest amount of fiat currency that a trade can be started with.
     * @type {number}
     * @memberof OfferObject
     */
    fiatAmountRangeMin?: number;
    /**
     * Fiat price of the offer per crypto.
     * @type {number}
     * @memberof OfferObject
     */
    fiatPricePerCrypto?: number;
    /**
     * 
     * @type {OfferObjectBankReferenceMessage}
     * @memberof OfferObject
     */
    bankReferenceMessage?: OfferObjectBankReferenceMessage;
    /**
     * Will be TRUE if a trade partner with connected VPN will be blocked.
     * @type {boolean}
     * @memberof OfferObject
     */
    blockAnonymizerUsers?: boolean;
    /**
     * Deprecated. Use 'fiat_usd_price_per_crypto'. Fiat USD price of the offer per crypto.
     * @type {number}
     * @memberof OfferObject
     */
    fiatUSDPricePerBtc?: number;
    /**
     * Will be TRUE if a trade partner is required to have their email verified.
     * @type {boolean}
     * @memberof OfferObject
     */
    requireVerifiedEmail?: boolean;
    /**
     * Will be TRUE if a trade partner is required to have their phone verified.
     * @type {boolean}
     * @memberof OfferObject
     */
    requireVerifiedPhone?: boolean;
    /**
     * Will be TRUE if the offer will be shown only to users from the trusted list.
     * @type {boolean}
     * @memberof OfferObject
     */
    showOnlyTrustedUser?: boolean;
    /**
     * Type of limitation countries. If 'allowed' is used then the offer will be visible ONLY for visitors from countries specified in the 'country_limitation_list'. If 'disallowed' is used then this offer will NOT be visible for visitors from countries specified in the 'country_limitation_list'.
     * @type {string}
     * @memberof OfferObject
     */
    countryLimitationList?: string;
    /**
     * Comma-separated list of 'ISO Alpha 2' country codes.
     * @type {string}
     * @memberof OfferObject
     */
    countryLimitationType?: string;
    /**
     * ISO country code of the offer owner.
     * @type {string}
     * @memberof OfferObject
     */
    offerOwnerCountryIso?: string;
    /**
     * The offer can be shown only to users with a given amount of past trades.
     * @type {string}
     * @memberof OfferObject
     */
    requireMinPastTrades?: string;
    /**
     * What is the max amount of fiat a new user can start a trade with for this offer.
     * @type {number}
     * @memberof OfferObject
     */
    newBuyerMaxFiatLimit?: number;
    /**
     * A link to the profile of the offer owner.
     * @type {string}
     * @memberof OfferObject
     */
    offerOwnerProfileLink?: string;
    /**
     * Fiat USD price of the offer per crypto.
     * @type {number}
     * @memberof OfferObject
     */
    fiatUsdPricePerCrypto?: number;
    /**
     * If the payment method is country-specific, the most relevant country associated with this payment method will be returned.
     * @type {string}
     * @memberof OfferObject
     */
    paymentMethodCountryName?: string;
    /**
     * A number of the negative feedback of the offer owner.
     * @type {number}
     * @memberof OfferObject
     */
    offerOwnerFeedbackNegative?: number;
    /**
     * A number of the positive feedback of the offer owner.
     * @type {number}
     * @memberof OfferObject
     */
    offerOwnerFeedbackPositive?: number;
    /**
     * Will be TRUE if an offer currency should match buyer's country currency.
     * @type {boolean}
     * @memberof OfferObject
     */
    requireOfferCurrencyMatchBuyerCountry?: boolean;
}

/**
 * @export
 * @namespace OfferObject
 */
export namespace OfferObject {
    /**
     * @export
     * @enum {string}
     */
    export enum FlowTypeEnum {
        Default = <any> 'default',
        Lite = <any> 'lite',
        GccAuto = <any> 'gcc-auto',
        BtAuto = <any> 'bt-auto'
    }
    /**
     * @export
     * @enum {string}
     */
    export enum LastSeenEnum {
        LastSeen = <any> 'last-seen',
        SeenLongAgo = <any> 'seen-long-ago',
        SeenRecently = <any> 'seen-recently',
        SeenVeryRecently = <any> 'seen-very-recently'
    }
    /**
     * @export
     * @enum {string}
     */
    export enum OfferTypeEnum {
        Sell = <any> 'sell',
        Buy = <any> 'buy'
    }
}
/**
 * Describes what reference message you expect a trade partner to provide.
 * @export
 * @interface OfferObjectBankReferenceMessage
 */
export interface OfferObjectBankReferenceMessage {
    /**
     * Defines how you expect to have bank reference message handled when a transfer is made by a trade partner.  *     If 'no_message' is chosen they you expect a trader parter to provide nothing in description when bank transfer is made;  *     if 'exact_message' is used then you expect your trade partner to provide exactly this specific message in description of the transfer, if this option is chosen then 'message' field becomes mandatory (see below);  *     if 'no_preference' is used then you don’t have any expectations how a trade partner should handle providing description of the transfer - s/he may or may not provide it.
     * @type {string}
     * @memberof OfferObjectBankReferenceMessage
     */
    type: OfferObjectBankReferenceMessage.TypeEnum;
    /**
     * If 'exact_message' is used for 'type', then this field must be provided. When a fiat transfer is made this is something you expect to have provided in description of the transfer.
     * @type {string}
     * @memberof OfferObjectBankReferenceMessage
     */
    message?: string;
}

/**
 * @export
 * @namespace OfferObjectBankReferenceMessage
 */
export namespace OfferObjectBankReferenceMessage {
    /**
     * @export
     * @enum {string}
     */
    export enum TypeEnum {
        NoMessage = <any> 'no_message',
        ExactMessage = <any> 'exact_message',
        NoPreference = <any> 'no_preference'
    }
}
/**
 * 
 * @export
 * @interface OfferPriceObject
 */
export interface OfferPriceObject {
    /**
     * Price of an offer in USD.
     * @type {number}
     * @memberof OfferPriceObject
     */
    price?: number;
    /**
     * Fiat currency code of an offer.
     * @type {string}
     * @memberof OfferPriceObject
     */
    currency?: string;
    /**
     * Type of the offer - buy/sell.
     * @type {string}
     * @memberof OfferPriceObject
     */
    offerType?: OfferPriceObject.OfferTypeEnum;
    /**
     * Crypto currency code. At the moment only recalculation in USD is supported.
     * @type {string}
     * @memberof OfferPriceObject
     */
    cryptoCurrency?: string;
}

/**
 * @export
 * @namespace OfferPriceObject
 */
export namespace OfferPriceObject {
    /**
     * @export
     * @enum {string}
     */
    export enum OfferTypeEnum {
        Sell = <any> 'sell',
        Buy = <any> 'buy'
    }
}
/**
 * 
 * @export
 * @interface OfferPriceResponse
 */
export interface OfferPriceResponse {
    /**
     * Price of an offer in USD.
     * @type {number}
     * @memberof OfferPriceResponse
     */
    price?: number;
    /**
     * Type of the fiat currency. Currently only USD supported.
     * @type {string}
     * @memberof OfferPriceResponse
     */
    currency?: string;
    /**
     * Crypto currency code. At the moment only recalculation in USD is supported.
     * @type {string}
     * @memberof OfferPriceResponse
     */
    cryptoCurrency?: string;
}
/**
 * 
 * @export
 * @interface OfferPricesResponse
 */
export interface OfferPricesResponse {
    /**
     * Number of returned items.
     * @type {number}
     * @memberof OfferPricesResponse
     */
    count?: number;
    /**
     * 
     * @type {OfferPricesResponsePrices}
     * @memberof OfferPricesResponse
     */
    prices?: OfferPricesResponsePrices;
}
/**
 * Prices, an array consisting of currency and price.
 * @export
 * @interface OfferPricesResponsePrices
 */
export interface OfferPricesResponsePrices {
    /**
     * 
     * @type {OfferPriceObject}
     * @memberof OfferPricesResponsePrices
     */
    offerHash?: OfferPriceObject;
}
/**
 * 
 * @export
 * @interface OfferTagListResponse
 */
export interface OfferTagListResponse {
    /**
     * Current page, by default is 1.
     * @type {number}
     * @memberof OfferTagListResponse
     */
    page?: number;
    /**
     * 
     * @type {Array<OfferTagsObject>}
     * @memberof OfferTagListResponse
     */
    tags?: Array<OfferTagsObject>;
    /**
     * Number of returned tags.
     * @type {number}
     * @memberof OfferTagListResponse
     */
    count?: number;
    /**
     * Limit count of result on the page.
     * @type {number}
     * @memberof OfferTagListResponse
     */
    limit?: number;
}
/**
 * 
 * @export
 * @interface OfferTagsObject
 */
export interface OfferTagsObject {
    /**
     * Tag name.
     * @type {string}
     * @memberof OfferTagsObject
     */
    name?: string;
    /**
     * Tag slug. This value is to be used when creating or updating offers.
     * @type {string}
     * @memberof OfferTagsObject
     */
    slug?: string;
    /**
     * Tag description.
     * @type {string}
     * @memberof OfferTagsObject
     */
    description?: string;
}
/**
 * 
 * @export
 * @interface OfferUpdateRequestBody
 */
export interface OfferUpdateRequestBody {
    /**
     * Comma-separated list of tags. For a list of available tags please refer to offer-tag/list and use 'slug' parameter.
     * @type {string}
     * @memberof OfferUpdateRequestBody
     */
    tags?: string;
    /**
     * A percent that determines differences between market price and the price of the offer.
     * @type {number}
     * @memberof OfferUpdateRequestBody
     */
    margin?: number;
    /**
     * 3 letter ISO code of fiat currency, e.g. USD. Case insensitive.
     * @type {string}
     * @memberof OfferUpdateRequestBody
     */
    currency?: string;
    /**
     * A flow type for offer.
     * @type {string}
     * @memberof OfferUpdateRequestBody
     */
    flowType?: string;
    /**
     * 
     * @type {OfferUpdateRequestBodyOfferCap}
     * @memberof OfferUpdateRequestBody
     */
    offerCap?: OfferUpdateRequestBodyOfferCap;
    /**
     * A maximum value of the trade limit, i.e the largest amount of fiat that a trade can be started with. (Minimum value for the field 1).
     * @type {number}
     * @memberof OfferUpdateRequestBody
     */
    rangeMax?: number;
    /**
     * A minimum value of the trade limit, i.e the smallest amount of fiat that a trade can be started with. (Minimum value for the field 1).
     * @type {number}
     * @memberof OfferUpdateRequestBody
     */
    rangeMin?: number;
    /**
     * An array of intervals when the offer is active for the week.
     * @type {Array<OfferDutyHours>}
     * @memberof OfferUpdateRequestBody
     */
    dutyHours?: Array<OfferDutyHours>;
    /**
     * A hash (ID) of the offer.
     * @type {string}
     * @memberof OfferUpdateRequestBody
     */
    offerHash: string;
    /**
     * Should be used only if the offer is created as a fixed price offer. If this parameter is used then 'margin' should not be specified.
     * @type {number}
     * @memberof OfferUpdateRequestBody
     */
    fixedPrice?: number;
    /**
     * Location id is needed to search for offers with specific payment methods, e.g. Cash in Person, Gold. If payment method is another - parameter will be ignored. You can find location ids here: https://www.geonames.org/. For better experience use locations ids of countries and cities.
     * @type {number}
     * @memberof OfferUpdateRequestBody
     */
    locationId?: number;
    /**
     * Terms of the offer for a trade partner. String up to 2500 characters.
     * @type {string}
     * @memberof OfferUpdateRequestBody
     */
    offerTerms?: string;
    /**
     * Comma-separated list of bank account UUIDs.
     * @type {string}
     * @memberof OfferUpdateRequestBody
     */
    bankAccounts?: string;
    /**
     * Instructions for a trade partner. String up to 2500 characters.
     * @type {string}
     * @memberof OfferUpdateRequestBody
     */
    tradeDetails?: string;
    /**
     * A slug of the payment method. To see a list of payment method slugs please refer to payment-method/list endpoint.
     * @type {string}
     * @memberof OfferUpdateRequestBody
     */
    paymentMethod?: string;
    /**
     * How much time the trade partner has to make the payment and click 'Paid' before the trade is automatically canceled. Integer between 30 to 43200.
     * @type {number}
     * @memberof OfferUpdateRequestBody
     */
    paymentWindow?: number;
    /**
     * 3 letter ISO country code (e.g. USA, EST, fra, etc.). If the payment method is country-specific, specify the most relevant country associated with this payment method.
     * @type {string}
     * @memberof OfferUpdateRequestBody
     */
    paymentCountry?: string;
    /**
     * Comma-separated predefined amounts of fiat currency, i.e. 20,30,50. If not specified, then a user can enter any amount within the offer range.
     * @type {string}
     * @memberof OfferUpdateRequestBody
     */
    predefinedAmount?: string;
    /**
     * A group of payment methods. For a list of available payment method groups please refer to payment-method-group/list endpoint.
     * @type {string}
     * @memberof OfferUpdateRequestBody
     */
    paymentMethodGroup?: OfferUpdateRequestBody.PaymentMethodGroupEnum;
    /**
     * A bank name will appear after the payment method. Maximum 25 characters and only letters, numbers, and dash. You can write several bank names separated by space, e.g. CBS SEB METROPOLITAN ALFA.
     * @type {string}
     * @memberof OfferUpdateRequestBody
     */
    paymentMethodLabel?: string;
    /**
     * 
     * @type {OfferUpdateRequestBodyBankReferenceMessage}
     * @memberof OfferUpdateRequestBody
     */
    bankReferenceMessage?: OfferUpdateRequestBodyBankReferenceMessage;
    /**
     * The offer will be shown only to users from the trusted list.
     * @type {boolean}
     * @memberof OfferUpdateRequestBody
     */
    showOnlyTrustedUser?: boolean;
    /**
     * Comma-separated list of 'ISO Alpha-2' country codes.
     * @type {string}
     * @memberof OfferUpdateRequestBody
     */
    countryLimitationList?: string;
    /**
     * Type of limitation countries. Valid values are 'allowed' or 'disallowed'. If 'allowed' is used then the offer will be visible ONLY for visitors from countries specified in the 'country_limitation_list'. If 'disallowed' is used then this offer will NOT be visible for visitors from countries specified in the 'country_limitation_list'.
     * @type {string}
     * @memberof OfferUpdateRequestBody
     */
    countryLimitationType?: string;
    /**
     * The offer will be shown only to users with a given amount of past trades.
     * @type {boolean}
     * @memberof OfferUpdateRequestBody
     */
    requireMinPastTrades?: boolean;
}

/**
 * @export
 * @namespace OfferUpdateRequestBody
 */
export namespace OfferUpdateRequestBody {
    /**
     * @export
     * @enum {string}
     */
    export enum PaymentMethodGroupEnum {
        GiftCards = <any> 'gift-cards',
        CashDeposits = <any> 'cash-deposits',
        OnlineTransfers = <any> 'online-transfers',
        DebitcreditCards = <any> 'debitcredit-cards'
    }
}
/**
 * Required for bank-transfer payment method with flow_type 'bt-auto'. Describes what reference message you expect a trade partner to provide.
 * @export
 * @interface OfferUpdateRequestBodyBankReferenceMessage
 */
export interface OfferUpdateRequestBodyBankReferenceMessage {
    /**
     * Defines how you expect to have bank reference message handled when a transfer is made by a trade partner.  *     If 'no_message' is chosen they you expect a trader parter to provide nothing in description when bank transfer is made;  *     if 'exact_message' is used then you expect your trade partner to provide exactly this specific message in description of the transfer, if this option is chosen then 'message' field becomes mandatory (see below);  *     if 'no_preference' is used then you don’t have any expectations how a trade partner should handle providing description of the transfer - s/he may or may not provide it.
     * @type {string}
     * @memberof OfferUpdateRequestBodyBankReferenceMessage
     */
    type: OfferUpdateRequestBodyBankReferenceMessage.TypeEnum;
    /**
     * If 'exact_message' is used for 'type', then this field must be provided. When a fiat transfer is made this is something you expect to have provided in description of the transfer.
     * @type {string}
     * @memberof OfferUpdateRequestBodyBankReferenceMessage
     */
    message?: string;
}

/**
 * @export
 * @namespace OfferUpdateRequestBodyBankReferenceMessage
 */
export namespace OfferUpdateRequestBodyBankReferenceMessage {
    /**
     * @export
     * @enum {string}
     */
    export enum TypeEnum {
        NoMessage = <any> 'no_message',
        ExactMessage = <any> 'exact_message',
        NoPreference = <any> 'no_preference'
    }
}
/**
 * 
 * @export
 * @interface OfferUpdateRequestBodyOfferCap
 */
export interface OfferUpdateRequestBodyOfferCap {
    /**
     * A flag to activate offer cap.
     * @type {boolean}
     * @memberof OfferUpdateRequestBodyOfferCap
     */
    active?: boolean;
    /**
     * The maximum amount of bitcoin/fiat currency that can be traded from all trades using this offer. The offer will be automatically deactivated once the cap limit is reached.
     * @type {number}
     * @memberof OfferUpdateRequestBodyOfferCap
     */
    amount?: number;
}
/**
 * 
 * @export
 * @interface PaymentMethodFeeResponse
 */
export interface PaymentMethodFeeResponse {
    /**
     * Number of returned payment methods.
     * @type {number}
     * @memberof PaymentMethodFeeResponse
     */
    count?: number;
    /**
     * BTC exchange rate to a given fiat currency (see 'currency' filter). By default is USD.
     * @type {string}
     * @memberof PaymentMethodFeeResponse
     */
    btcRate?: string;
    /**
     * Fiat currency that is used to calculate fees/rates.
     * @type {string}
     * @memberof PaymentMethodFeeResponse
     */
    fiatCurrency?: string;
    /**
     * 
     * @type {PaymentMethodFeeResponsePaymentMethods}
     * @memberof PaymentMethodFeeResponse
     */
    paymentMethods?: PaymentMethodFeeResponsePaymentMethods;
}
/**
 * 
 * @export
 * @interface PaymentMethodFeeResponsePaymentMethods
 */
export interface PaymentMethodFeeResponsePaymentMethods {
    /**
     * 
     * @type {PaymentMethodFeeResponsePaymentMethodsGitfcard}
     * @memberof PaymentMethodFeeResponsePaymentMethods
     */
    gitfCard?: PaymentMethodFeeResponsePaymentMethodsGitfcard;
}
/**
 * Payment method slug is the key.
 * @export
 * @interface PaymentMethodFeeResponsePaymentMethodsGitfcard
 */
export interface PaymentMethodFeeResponsePaymentMethodsGitfcard {
    /**
     * Average positive margin of completed trades for the last 10 days.
     * @type {string}
     * @memberof PaymentMethodFeeResponsePaymentMethodsGitfcard
     */
    avgTo?: string;
    /**
     * Average positive margin of completed trades for the last 3 days.
     * @type {string}
     * @memberof PaymentMethodFeeResponsePaymentMethodsGitfcard
     */
    avgFrom?: string;
}
/**
 * 
 * @export
 * @interface PaymentMethodGroup
 */
export interface PaymentMethodGroup {
    /**
     * Payment method group name, always in English.
     * @type {string}
     * @memberof PaymentMethodGroup
     */
    name?: string;
    /**
     * Payment method group slug.
     * @type {string}
     * @memberof PaymentMethodGroup
     */
    slug?: string;
    /**
     * 
     * @type {PaymentMethodGroupDescription}
     * @memberof PaymentMethodGroup
     */
    description?: PaymentMethodGroupDescription;
    /**
     * Localized payment method group name. Depends on value of 'locale' filter.
     * @type {string}
     * @memberof PaymentMethodGroup
     */
    nameLocalized?: string;
}
/**
 * 
 * @export
 * @interface PaymentMethodGroupDescription
 */
export interface PaymentMethodGroupDescription {
    /**
     * 
     * @type {PaymentMethodGroupDescriptionBuy}
     * @memberof PaymentMethodGroupDescription
     */
    buy?: PaymentMethodGroupDescriptionBuy;
    /**
     * 
     * @type {PaymentMethodGroupDescriptionSell}
     * @memberof PaymentMethodGroupDescription
     */
    sell?: PaymentMethodGroupDescriptionSell;
    /**
     * Payment method group description, always in English.
     * @type {string}
     * @memberof PaymentMethodGroupDescription
     */
    original?: string;
    /**
     * Localized payment method group description. Depends on value of 'locale' filter.
     * @type {string}
     * @memberof PaymentMethodGroupDescription
     */
    localized?: string;
}
/**
 * 
 * @export
 * @interface PaymentMethodGroupDescriptionBuy
 */
export interface PaymentMethodGroupDescriptionBuy {
    /**
     * Localized payment method group description for Sell BTC offers. Depends on value of 'locale' filter.
     * @type {string}
     * @memberof PaymentMethodGroupDescriptionBuy
     */
    btc?: string;
    /**
     * Localized payment method group description for Sell ETH offers. Depends on value of 'locale' filter.
     * @type {string}
     * @memberof PaymentMethodGroupDescriptionBuy
     */
    eth?: string;
    /**
     * Localized payment method group description for Sell USDT offers. Depends on value of 'locale' filter.
     * @type {string}
     * @memberof PaymentMethodGroupDescriptionBuy
     */
    usdt?: string;
}
/**
 * 
 * @export
 * @interface PaymentMethodGroupDescriptionSell
 */
export interface PaymentMethodGroupDescriptionSell {
    /**
     * Localized payment method group description for Buy BTC offers. Depends on value of 'locale' filter.
     * @type {string}
     * @memberof PaymentMethodGroupDescriptionSell
     */
    btc?: string;
    /**
     * Localized payment method group description for Buy ETH offers. Depends on value of 'locale' filter.
     * @type {string}
     * @memberof PaymentMethodGroupDescriptionSell
     */
    eth?: string;
    /**
     * Localized payment method group description for Buy USDT offers. Depends on value of 'locale' filter.
     * @type {string}
     * @memberof PaymentMethodGroupDescriptionSell
     */
    usdt?: string;
}
/**
 * 
 * @export
 * @interface PaymentMethodGroupResponse
 */
export interface PaymentMethodGroupResponse {
    /**
     * 
     * @type {Array<PaymentMethodGroup>}
     * @memberof PaymentMethodGroupResponse
     */
    data?: Array<PaymentMethodGroup>;
    /**
     * Will have value 'success' if the request is successful, otherwise - 'error'.
     * @type {string}
     * @memberof PaymentMethodGroupResponse
     */
    status?: string;
    /**
     * Timestamp when request has been received and acknowledged by the server.
     * @type {number}
     * @memberof PaymentMethodGroupResponse
     */
    timestamp?: number;
}
/**
 * 
 * @export
 * @interface PaymentMethodList
 */
export interface PaymentMethodList {
    /**
     * Payment method name.
     * @type {string}
     * @memberof PaymentMethodList
     */
    name?: string;
    /**
     * Payment method slug.
     * @type {string}
     * @memberof PaymentMethodList
     */
    slug?: string;
}
/**
 * 
 * @export
 * @interface PaymentMethodListResponse
 */
export interface PaymentMethodListResponse {
    /**
     * List of payment methods including their name and slug.
     * @type {Array<PaymentMethodList>}
     * @memberof PaymentMethodListResponse
     */
    data?: Array<PaymentMethodList>;
    /**
     * Will have value 'success' if the request is successful, otherwise - 'error'.
     * @type {string}
     * @memberof PaymentMethodListResponse
     */
    status?: string;
    /**
     * Timestamp when request has been received and acknowledged by the server.
     * @type {number}
     * @memberof PaymentMethodListResponse
     */
    timestamp?: number;
}
/**
 * 
 * @export
 * @interface RequestBodyAffiliateTransactions
 */
export interface RequestBodyAffiliateTransactions {
    /**
     * Requested page, by default is 1
     * @type {number}
     * @memberof RequestBodyAffiliateTransactions
     */
    page?: number;
}
/**
 * 
 * @export
 * @interface RequestBodyBankAccountCreate
 */
export interface RequestBodyBankAccountCreate {
    /**
     * IBAN.
     * @type {string}
     * @memberof RequestBodyBankAccountCreate
     */
    iban?: string;
    /**
     * IFSC.
     * @type {string}
     * @memberof RequestBodyBankAccountCreate
     */
    ifsc?: string;
    /**
     * Clabe.
     * @type {string}
     * @memberof RequestBodyBankAccountCreate
     */
    clabe?: string;
    /**
     * Bank name.
     * @type {string}
     * @memberof RequestBodyBankAccountCreate
     */
    bankName?: string;
    /**
     * Bank ID.
     * @type {string}
     * @memberof RequestBodyBankAccountCreate
     */
    bankUuid?: string;
    /**
     * Swift code.
     * @type {string}
     * @memberof RequestBodyBankAccountCreate
     */
    swiftCode?: string;
    /**
     * ISO country code of the offer owner.
     * @type {string}
     * @memberof RequestBodyBankAccountCreate
     */
    countryIso: string;
    /**
     * Holder name.
     * @type {string}
     * @memberof RequestBodyBankAccountCreate
     */
    holderName: string;
    /**
     * Is personal or business account.
     * @type {boolean}
     * @memberof RequestBodyBankAccountCreate
     */
    isPersonal: boolean;
    /**
     * Bank account number.
     * @type {string}
     * @memberof RequestBodyBankAccountCreate
     */
    accountNumber?: string;
    /**
     * Routing number.
     * @type {string}
     * @memberof RequestBodyBankAccountCreate
     */
    routingNumber?: string;
    /**
     * Additional information about bank account with country-specific data.
     * @type {string}
     * @memberof RequestBodyBankAccountCreate
     */
    additionalInfo?: string;
    /**
     * 3 letter ISO code for fiat currency.
     * @type {string}
     * @memberof RequestBodyBankAccountCreate
     */
    fiatCurrencyCode: string;
    /**
     * International details.
     * @type {Array<InternationalDetailsObject>}
     * @memberof RequestBodyBankAccountCreate
     */
    internationalDetails?: Array<InternationalDetailsObject>;
}
/**
 * 
 * @export
 * @interface RequestBodyBankAccountId
 */
export interface RequestBodyBankAccountId {
    /**
     * Bank account uuid.
     * @type {string}
     * @memberof RequestBodyBankAccountId
     */
    bankAccountUuid: string;
}
/**
 * 
 * @export
 * @interface RequestBodyBankList
 */
export interface RequestBodyBankList {
    /**
     * ISO country code of the offer owner.
     * @type {string}
     * @memberof RequestBodyBankList
     */
    countryIso: string;
}
/**
 * 
 * @export
 * @interface RequestBodyFeedbackGive
 */
export interface RequestBodyFeedbackGive {
    /**
     * Rating. Possible values: 1(positive), -1(negative).
     * @type {number}
     * @memberof RequestBodyFeedbackGive
     */
    rating: RequestBodyFeedbackGive.RatingEnum;
    /**
     * Feedback message.
     * @type {string}
     * @memberof RequestBodyFeedbackGive
     */
    message: string;
    /**
     * A hash (ID) of the trade.
     * @type {string}
     * @memberof RequestBodyFeedbackGive
     */
    tradeHash: string;
}

/**
 * @export
 * @namespace RequestBodyFeedbackGive
 */
export namespace RequestBodyFeedbackGive {
    /**
     * @export
     * @enum {string}
     */
    export enum RatingEnum {
        NUMBER_1 = <any> 1,
        NUMBER_MINUS_1 = <any> -1
    }
}
/**
 * 
 * @export
 * @interface RequestBodyFeedbackList
 */
export interface RequestBodyFeedbackList {
    /**
     * A page to return, 10 feedback per page.
     * @type {number}
     * @memberof RequestBodyFeedbackList
     */
    page?: number;
    /**
     * What kind of feedack to fetch - either from 'buyers' or 'sellers'. Possible values: 'buyer', 'seller'.
     * @type {string}
     * @memberof RequestBodyFeedbackList
     */
    role?: RequestBodyFeedbackList.RoleEnum;
    /**
     * Rating. Possible values: 1(positive), -1(negative).
     * @type {number}
     * @memberof RequestBodyFeedbackList
     */
    rating?: RequestBodyFeedbackList.RatingEnum;
    /**
     * Username of a trader who you want to fetch feedback for. Either this filter or 'offer_hash' has to be used, if both are provided then an error will be returned.
     * @type {string}
     * @memberof RequestBodyFeedbackList
     */
    username?: string;
    /**
     * A hash (ID) of an offer. Either this filter or 'username' has to be used, if both are provided then an error will be returned.
     * @type {string}
     * @memberof RequestBodyFeedbackList
     */
    offerHash?: string;
}

/**
 * @export
 * @namespace RequestBodyFeedbackList
 */
export namespace RequestBodyFeedbackList {
    /**
     * @export
     * @enum {string}
     */
    export enum RoleEnum {
        Buyer = <any> 'buyer',
        Seller = <any> 'seller'
    }
    /**
     * @export
     * @enum {string}
     */
    export enum RatingEnum {
        NUMBER_1 = <any> 1,
        NUMBER_MINUS_1 = <any> -1
    }
}
/**
 * 
 * @export
 * @interface RequestBodyFeedbackReply
 */
export interface RequestBodyFeedbackReply {
    /**
     * Reply message.
     * @type {string}
     * @memberof RequestBodyFeedbackReply
     */
    message: string;
    /**
     * A hash (ID) of the trade.
     * @type {string}
     * @memberof RequestBodyFeedbackReply
     */
    tradeHash: string;
}
/**
 * 
 * @export
 * @interface RequestBodyLocale
 */
export interface RequestBodyLocale {
    /**
     * Locale code, e.g. ru, pt_BR.
     * @type {string}
     * @memberof RequestBodyLocale
     */
    locale?: string;
}
/**
 * 
 * @export
 * @interface RequestBodyNotificationsList
 */
export interface RequestBodyNotificationsList {
    /**
     * Requested page, by default is 1. Every page returns up to 50 notifications.
     * @type {number}
     * @memberof RequestBodyNotificationsList
     */
    page?: number;
    /**
     * If FALSE then only unread notifications will be returned. If filter is not specified, then both read and unread ones will be returned.
     * @type {boolean}
     * @memberof RequestBodyNotificationsList
     */
    isRead?: boolean;
}
/**
 * 
 * @export
 * @interface RequestBodyOfferAll
 */
export interface RequestBodyOfferAll {
    /**
     * Will return offers of given type without applying a domain logic that 'offer_type' filter has. If you specify 'sell' then offers with this type will be returned and so on. See also offer_type filter. Either 'offer_type' or 'type' filter needs to be provided. If 'offer_type' filter is provided then this filter will be ignored. Possible values: 'buy', 'sell'.
     * @type {string}
     * @memberof RequestBodyOfferAll
     */
    type?: RequestBodyOfferAll.TypeEnum;
    /**
     * A group of payment methods(slug). For a list of available payment method groups please refer to payment-method-group/list endpoint.
     * @type {string}
     * @memberof RequestBodyOfferAll
     */
    group?: string;
    /**
     * How many offers to return.
     * @type {number}
     * @memberof RequestBodyOfferAll
     */
    limit?: number;
    /**
     * An offset for a result.
     * @type {number}
     * @memberof RequestBodyOfferAll
     */
    offset?: number;
    /**
     * Will return offers where this value either fits into trade limits or equals to a predefined amount.
     * @type {number}
     * @memberof RequestBodyOfferAll
     */
    fiatMin?: number;
    /**
     * Deprecated field. Please use location_id.
     * @type {number}
     * @memberof RequestBodyOfferAll
     */
    geonameId?: number;
    /**
     * Search offers with margin less than the value. Ignored when offer is of fixed price.
     * @type {number}
     * @memberof RequestBodyOfferAll
     */
    marginMax?: number;
    /**
     * Search offers with margin greater than the value. Ignored when offer is of fixed price.
     * @type {number}
     * @memberof RequestBodyOfferAll
     */
    marginMin?: number;
    /**
     * If you would like to get offers that you can use <b>to buy crypto</b>, then in fact you need to see offers <b>where other vendors are selling crypto</b>, hence you need to specify 'buy' to get 'sell' offers and vice versa. If you just would like to get offers filtered by type they have, then you can use 'type' parameter instead. Either 'offer_type' or 'type' filter needs to be provided. If this filter is provided then 'type' will be ignored.
     * @type {string}
     * @memberof RequestBodyOfferAll
     */
    offerType: RequestBodyOfferAll.OfferTypeEnum;
    /**
     * Comma separated list of user types whose offers to return - i.e. power_trader, expert_trader. For a list of all available user types please refer to user/types endpoint. You can also provide “all” value, in this case offers of users of either available type will be returned.
     * @type {string}
     * @memberof RequestBodyOfferAll
     */
    userTypes?: string;
    /**
     * Location id is needed to search for offers with specific payment methods, e.g. Cash in Person, Gold. If payment method is another - parameter will be ignored. You can find location ids here: https://www.geonames.org/. For better experience use locations ids of countries and cities.
     * @type {number}
     * @memberof RequestBodyOfferAll
     */
    locationId?: number;
    /**
     * ISO country code, e.g. 'US'. Filter offers by available payment methods in the given country. Please use 'WORLDWIDE' if you want to get offers from all countries. For authenticated user by default automatically detected country will be used. For non-authenticated user 'US' will be used. This filter corresponds to 'Offer location' filter available on marketplace.
     * @type {string}
     * @memberof RequestBodyOfferAll
     */
    userCountry?: string;
    /**
     * 3 letter ISO code for fiat currency. 'USD' or any other. Case insensitive.
     * @type {string}
     * @memberof RequestBodyOfferAll
     */
    currencyCode?: string;
    /**
     * A slug of the payment method. To see a list of payment method slugs please refer to payment-method/list endpoint.
     * @type {string}
     * @memberof RequestBodyOfferAll
     */
    paymentMethod?: string;
    /**
     * Search offers with trade limit less than the value.
     * @type {number}
     * @memberof RequestBodyOfferAll
     */
    fiatAmountMax?: number;
    /**
     * Search offers with trade limit greater than the value.
     * @type {number}
     * @memberof RequestBodyOfferAll
     */
    fiatAmountMin?: number;
    /**
     * A filter by crypto currency code, default is 'btc'. For a list of current supported cryptocurrencies please refer to crypto/list endpoint.
     * @type {string}
     * @memberof RequestBodyOfferAll
     */
    cryptoCurrencyCode?: string;
    /**
     * Search offers with fiat price per crypto less than the value.
     * @type {number}
     * @memberof RequestBodyOfferAll
     */
    fiatFixedPriceMax?: number;
    /**
     * Search offers with fiat price per crypto greater than the value.
     * @type {number}
     * @memberof RequestBodyOfferAll
     */
    fiatFixedPriceMin?: number;
}

/**
 * @export
 * @namespace RequestBodyOfferAll
 */
export namespace RequestBodyOfferAll {
    /**
     * @export
     * @enum {string}
     */
    export enum TypeEnum {
        Sell = <any> 'sell',
        Buy = <any> 'buy'
    }
    /**
     * @export
     * @enum {string}
     */
    export enum OfferTypeEnum {
        Sell = <any> 'sell',
        Buy = <any> 'buy'
    }
}
/**
 * 
 * @export
 * @interface RequestBodyOfferCreate
 */
export interface RequestBodyOfferCreate {
    /**
     * Comma-separated list of tags. For a list of available tags please refer to offer-tag/list and use 'slug' parameter.
     * @type {string}
     * @memberof RequestBodyOfferCreate
     */
    tags?: string;
    /**
     * A percent that determines differences between market price and the price of the offer.
     * @type {number}
     * @memberof RequestBodyOfferCreate
     */
    margin: number;
    /**
     * 3 letter ISO code for fiat currency. 'USD' or any other. Case insensitive.
     * @type {string}
     * @memberof RequestBodyOfferCreate
     */
    currency: string;
    /**
     * A flow type for offer.
     * @type {string}
     * @memberof RequestBodyOfferCreate
     */
    flowType?: string;
    /**
     * A maximum value of the trade limit, i.e the largest amount of fiat that a trade can be started with. (Minimum value for the field 1).
     * @type {number}
     * @memberof RequestBodyOfferCreate
     */
    rangeMax: number;
    /**
     * A minimum value of the trade limit, i.e the smallest amount of fiat that a trade can be started with. (Minimum value for the field 1).
     * @type {number}
     * @memberof RequestBodyOfferCreate
     */
    rangeMin: number;
    /**
     * Should be used only if the offer is created as a fixed price offer. If this parameter is used then 'margin' should not be specified.
     * @type {number}
     * @memberof RequestBodyOfferCreate
     */
    fixedPrice?: number;
    /**
     * Location id is needed to search for offers with specific payment methods, e.g. Cash in Person, Gold. If payment method is another - parameter will be ignored. You can find location ids here: https://www.geonames.org/. For better experience use locations ids of countries and cities.
     * @type {number}
     * @memberof RequestBodyOfferCreate
     */
    locationId?: number;
    /**
     * Terms of the offer for a trade partner. String up to 2500 characters.
     * @type {string}
     * @memberof RequestBodyOfferCreate
     */
    offerTerms: string;
    /**
     * Comma-separated list of bank account UUIDs.
     * @type {string}
     * @memberof RequestBodyOfferCreate
     */
    bankAccounts?: string;
    /**
     * Instructions for a trade partner. String up to 2500 characters.
     * @type {string}
     * @memberof RequestBodyOfferCreate
     */
    tradeDetails: string;
    /**
     * Fixes the price of your cryptocurrency, rather than using the market price. If this field is used, then you should also specify a value for 'fixed_price'.
     * @type {boolean}
     * @memberof RequestBodyOfferCreate
     */
    isFixedPrice?: boolean;
    /**
     * A slug of the payment method. To see a list of payment method slugs please refer to payment-method/list endpoint.
     * @type {string}
     * @memberof RequestBodyOfferCreate
     */
    paymentMethod: string;
    /**
     * How much time the trade partner has to make the payment and click 'Paid' before the trade is automatically canceled. Integer between 30 to 43200.
     * @type {number}
     * @memberof RequestBodyOfferCreate
     */
    paymentWindow: number;
    /**
     * A cryptocurrency that this offer will use, a code should be specified. For example - btc, eth. If not set, then 'btc' will be used as a default.
     * @type {string}
     * @memberof RequestBodyOfferCreate
     */
    cryptoCurrency?: string;
    /**
     * 3 letter ISO country code (e.g. USA, EST, fra, etc.). If the payment method is country-specific, specify the most relevant country associated with this payment method.
     * @type {string}
     * @memberof RequestBodyOfferCreate
     */
    paymentCountry?: string;
    /**
     * An offer type. Possible values: 'buy', 'sell'.
     * @type {string}
     * @memberof RequestBodyOfferCreate
     */
    offerTypeField: RequestBodyOfferCreate.OfferTypeFieldEnum;
    /**
     * Comma-separated predefined amounts of fiat currency, i.e. 20,30,50. If not specified, then a user can enter any amount within the offer range.
     * @type {string}
     * @memberof RequestBodyOfferCreate
     */
    predefinedAmount?: string;
    /**
     * A group of payment methods. For a list of available payment method groups please refer to payment-method-group/list endpoint.
     * @type {string}
     * @memberof RequestBodyOfferCreate
     */
    paymentMethodGroup?: RequestBodyOfferCreate.PaymentMethodGroupEnum;
    /**
     * A bank name will appear after the payment method. Maximum 25 characters and only letters, numbers, and dash. You can write several bank names separated by space. For example: CBS SEB METROPOLITAN ALFA.
     * @type {string}
     * @memberof RequestBodyOfferCreate
     */
    paymentMethodLabel?: string;
    /**
     * 
     * @type {OfferUpdateRequestBodyBankReferenceMessage}
     * @memberof RequestBodyOfferCreate
     */
    bankReferenceMessage?: OfferUpdateRequestBodyBankReferenceMessage;
    /**
     * The offer will be shown only to users from the trusted list.
     * @type {boolean}
     * @memberof RequestBodyOfferCreate
     */
    showOnlyTrustedUser?: boolean;
    /**
     * Comma-separated list of 'ISO Alpha-2' country codes.
     * @type {string}
     * @memberof RequestBodyOfferCreate
     */
    countryLimitationList?: string;
    /**
     * Type of limitation countries. Valid values are 'allowed' or 'disallowed'. If 'allowed' is used then the offer will be visible ONLY for visitors from countries specified in the 'country_limitation_list'. If 'disallowed' is used then this offer will NOT be visible for visitors from countries specified in the 'country_limitation_list'.
     * @type {string}
     * @memberof RequestBodyOfferCreate
     */
    countryLimitationType?: RequestBodyOfferCreate.CountryLimitationTypeEnum;
    /**
     * The offer will be shown only to users with a given amount of past trades.
     * @type {number}
     * @memberof RequestBodyOfferCreate
     */
    requireMinPastTrades?: number;
}

/**
 * @export
 * @namespace RequestBodyOfferCreate
 */
export namespace RequestBodyOfferCreate {
    /**
     * @export
     * @enum {string}
     */
    export enum OfferTypeFieldEnum {
        Sell = <any> 'sell',
        Buy = <any> 'buy'
    }
    /**
     * @export
     * @enum {string}
     */
    export enum PaymentMethodGroupEnum {
        GiftCards = <any> 'gift-cards',
        CashDeposits = <any> 'cash-deposits',
        OnlineTransfers = <any> 'online-transfers',
        DebitcreditCards = <any> 'debitcredit-cards'
    }
    /**
     * @export
     * @enum {string}
     */
    export enum CountryLimitationTypeEnum {
        Allowed = <any> 'allowed',
        Disallowed = <any> 'disallowed'
    }
}
/**
 * 
 * @export
 * @interface RequestBodyOfferGet
 */
export interface RequestBodyOfferGet {
    /**
     * A hash (ID) of the offer.
     * @type {string}
     * @memberof RequestBodyOfferGet
     */
    offerHash: string;
}
/**
 * 
 * @export
 * @interface RequestBodyOfferList
 */
export interface RequestBodyOfferList {
    /**
     * A filter by active/not active offers, by default all offers are displayed.
     * @type {boolean}
     * @memberof RequestBodyOfferList
     */
    active?: boolean;
    /**
     * An offer type. Possible values: 'buy', 'sell'.
     * @type {string}
     * @memberof RequestBodyOfferList
     */
    offerType: RequestBodyOfferList.OfferTypeEnum;
}

/**
 * @export
 * @namespace RequestBodyOfferList
 */
export namespace RequestBodyOfferList {
    /**
     * @export
     * @enum {string}
     */
    export enum OfferTypeEnum {
        Sell = <any> 'sell',
        Buy = <any> 'buy'
    }
}
/**
 * 
 * @export
 * @interface RequestBodyOfferPrices
 */
export interface RequestBodyOfferPrices {
    /**
     * A slug of the payment method. To see a list of payment method slugs please refer to payment-method/list endpoint.
     * @type {string}
     * @memberof RequestBodyOfferPrices
     */
    paymentMethod: string;
}
/**
 * Required one of margin or fixed_price
 * @export
 * @interface RequestBodyOfferUpdatePrice
 */
export interface RequestBodyOfferUpdatePrice {
    /**
     * A percent that determines differences between market price and the price of the offer.
     * @type {number}
     * @memberof RequestBodyOfferUpdatePrice
     */
    margin?: number;
    /**
     * A hash (ID) of the offer.
     * @type {string}
     * @memberof RequestBodyOfferUpdatePrice
     */
    offerHash: string;
    /**
     * Should be used only if the offer is created as a fixed price offer. If this parameter is used then 'margin' should not be specified.
     * @type {number}
     * @memberof RequestBodyOfferUpdatePrice
     */
    fixedPrice?: number;
}
/**
 * 
 * @export
 * @interface RequestBodyPaymentMethodFee
 */
export interface RequestBodyPaymentMethodFee {
    /**
     * Payment method slug. For a list of available payment method slugs please refer to payment-method/list endpoint.
     * @type {string}
     * @memberof RequestBodyPaymentMethodFee
     */
    slug?: string;
    /**
     * Fiat currency code, by default is USD. For a list of supported fiat currencies please refer to currency/list endpoint.
     * @type {string}
     * @memberof RequestBodyPaymentMethodFee
     */
    currency?: string;
}
/**
 * 
 * @export
 * @interface RequestBodyTradeAddProof
 */
export interface RequestBodyTradeAddProof {
    /**
     * Url and mimetype for the attached file as proof.
     * @type {Array<RequestBodyTradeAddProofFiles>}
     * @memberof RequestBodyTradeAddProof
     */
    files: Array<RequestBodyTradeAddProofFiles>;
}
/**
 * 
 * @export
 * @interface RequestBodyTradeAddProofFiles
 */
export interface RequestBodyTradeAddProofFiles {
    /**
     * 
     * @type {string}
     * @memberof RequestBodyTradeAddProofFiles
     */
    url?: string;
    /**
     * 
     * @type {string}
     * @memberof RequestBodyTradeAddProofFiles
     */
    mimetype?: string;
}
/**
 * 
 * @export
 * @interface RequestBodyTradeChatGet
 */
export interface RequestBodyTradeChatGet {
    /**
     * A hash (ID) of the trade.
     * @type {string}
     * @memberof RequestBodyTradeChatGet
     */
    tradeHash: string;
}
/**
 * 
 * @export
 * @interface RequestBodyTradeChatImage
 */
export interface RequestBodyTradeChatImage {
    /**
     * Size to fetch, either 1 (original), 2 (full sized) or 3 (thumbnail).
     * @type {string}
     * @memberof RequestBodyTradeChatImage
     */
    size?: RequestBodyTradeChatImage.SizeEnum;
    /**
     * Hash ID of an image. To get the hash id please refer to the image_hash parameter in response of the trade-chat/get endpoint.
     * @type {string}
     * @memberof RequestBodyTradeChatImage
     */
    imageHash: string;
}

/**
 * @export
 * @namespace RequestBodyTradeChatImage
 */
export namespace RequestBodyTradeChatImage {
    /**
     * @export
     * @enum {string}
     */
    export enum SizeEnum {
        _1 = <any> '1',
        _2 = <any> '2',
        _3 = <any> '3'
    }
}
/**
 * 
 * @export
 * @interface RequestBodyTradeChatImageAdd
 */
export interface RequestBodyTradeChatImageAdd {
    /**
     * URL of a publicly accessible file in the Internet. Supported formats are jpeg, png, jpg. Files up to 10mb are only allowed. When the endpoint is invoked, Paxful will download an image from the specified URL and post it to a given trade chat. Please consider using image/upload endpoint instead as it will process uploaded image instantly.
     * @type {string}
     * @memberof RequestBodyTradeChatImageAdd
     */
    file: string;
    /**
     * A hash (ID) of the trade.
     * @type {string}
     * @memberof RequestBodyTradeChatImageAdd
     */
    tradeHash: string;
}
/**
 * 
 * @export
 * @interface RequestBodyTradeChatImageUpload
 */
export interface RequestBodyTradeChatImageUpload {
    /**
     * File to upload. Supported formats are jpeg, png, jpg. Files up to 10mb are only allowed.
     * @type {Blob}
     * @memberof RequestBodyTradeChatImageUpload
     */
    file: Blob;
    /**
     * A hash (ID) of the trade.
     * @type {string}
     * @memberof RequestBodyTradeChatImageUpload
     */
    tradeHash: string;
}
/**
 * 
 * @export
 * @interface RequestBodyTradeChatLatest
 */
export interface RequestBodyTradeChatLatest {
    /**
     * Hash ID of a trade. If specified, method returns latest messages only for this trade. If omitted, the method return latest messages/attachments for all active trades.
     * @type {string}
     * @memberof RequestBodyTradeChatLatest
     */
    tradeHash?: string;
}
/**
 * 
 * @export
 * @interface RequestBodyTradeChatPost
 */
export interface RequestBodyTradeChatPost {
    /**
     * Message content.
     * @type {string}
     * @memberof RequestBodyTradeChatPost
     */
    message: string;
    /**
     * A hash (ID) of the trade.
     * @type {string}
     * @memberof RequestBodyTradeChatPost
     */
    tradeHash: string;
}
/**
 * 
 * @export
 * @interface RequestBodyTradeCompleted
 */
export interface RequestBodyTradeCompleted {
    /**
     * Requested page, by default is 1.
     * @type {number}
     * @memberof RequestBodyTradeCompleted
     */
    page?: number;
    /**
     * Username of a partner.
     * @type {string}
     * @memberof RequestBodyTradeCompleted
     */
    partner?: string;
}
/**
 * 
 * @export
 * @interface RequestBodyTradeDispute
 */
export interface RequestBodyTradeDispute {
    /**
     * Description of the dispute reason, max length 250 characters.
     * @type {string}
     * @memberof RequestBodyTradeDispute
     */
    reason: string;
    /**
     * A hash (ID) of the trade.
     * @type {string}
     * @memberof RequestBodyTradeDispute
     */
    tradeHash: string;
    /**
     * Type of reason, for available reasons refer to trade/dispute-reasons endpoint.
     * @type {string}
     * @memberof RequestBodyTradeDispute
     */
    reasonType?: RequestBodyTradeDispute.ReasonTypeEnum;
}

/**
 * @export
 * @namespace RequestBodyTradeDispute
 */
export namespace RequestBodyTradeDispute {
    /**
     * @export
     * @enum {string}
     */
    export enum ReasonTypeEnum {
        BuyerUnresponsiveVendor = <any> 'buyer_unresponsive_vendor',
        BuyerPaymentIssue = <any> 'buyer_payment_issue',
        BuyerOther = <any> 'buyer_other',
        VendorCoinlocker = <any> 'vendor_coinlocker',
        VendorPaymentIssue = <any> 'vendor_payment_issue',
        VendorOther = <any> 'vendor_other'
    }
}
/**
 * 
 * @export
 * @interface RequestBodyTradeGet
 */
export interface RequestBodyTradeGet {
    /**
     * A hash (ID) of the trade.
     * @type {string}
     * @memberof RequestBodyTradeGet
     */
    tradeHash: string;
}
/**
 * 
 * @export
 * @interface RequestBodyTradeStart
 */
export interface RequestBodyTradeStart {
    /**
     * Trade amount in fiat currency.
     * @type {number}
     * @memberof RequestBodyTradeStart
     */
    fiat?: number;
    /**
     * Deprecated. Please use crypto_amount instead.
     * @type {number}
     * @memberof RequestBodyTradeStart
     */
    satoshi?: number;
    /**
     * A hash (ID) of an offer.
     * @type {string}
     * @memberof RequestBodyTradeStart
     */
    offerHash: string;
    /**
     * Bank accounts that will be used for a given trade.
     * @type {Array<RequestBodyTradeStartBankAccounts>}
     * @memberof RequestBodyTradeStart
     */
    bankAccounts?: Array<RequestBodyTradeStartBankAccounts>;
    /**
     * Trade amount in cryptocurrency. For BTC trade in Satoshi, for ETH trade in GWEI, for USDT trade in micro cents (e.g 1 usdt = 1000000 micro cents).
     * @type {number}
     * @memberof RequestBodyTradeStart
     */
    cryptoAmount?: number;
}
/**
 * 
 * @export
 * @interface RequestBodyTradeStartBankAccounts
 */
export interface RequestBodyTradeStartBankAccounts {
    /**
     * 
     * @type {string}
     * @memberof RequestBodyTradeStartBankAccounts
     */
    to?: string;
}
/**
 * 
 * @export
 * @interface RequestBodyTransactionsAll
 */
export interface RequestBodyTransactionsAll {
    /**
     * Requested page, by default is 1.
     * @type {number}
     * @memberof RequestBodyTransactionsAll
     */
    page?: number;
    /**
     * Type of transaction. Possible values: 'trade', 'non-trade', 'received', 'received-internal', 'received-external', 'sent', 'sent-internal', 'sent-external', 'hedging', 'all'. By default is 'all'.
     * @type {string}
     * @memberof RequestBodyTransactionsAll
     */
    type?: RequestBodyTransactionsAll.TypeEnum;
    /**
     * A number of transactions to return. By default is 100.
     * @type {number}
     * @memberof RequestBodyTransactionsAll
     */
    limit?: number;
    /**
     * Filter by cryptocurrency code. Use 'all' value to get a list of transactions with all supported cryptocurrencies. Default is btc. For a list of current supported cryptocurrencies please refer to crypto/list endpoint.
     * @type {string}
     * @memberof RequestBodyTransactionsAll
     */
    cryptoCurrencyCode?: string;
}

/**
 * @export
 * @namespace RequestBodyTransactionsAll
 */
export namespace RequestBodyTransactionsAll {
    /**
     * @export
     * @enum {string}
     */
    export enum TypeEnum {
        Trade = <any> 'trade',
        NonTrade = <any> 'non-trade',
        Received = <any> 'received',
        ReceivedInternal = <any> 'received-internal',
        ReceivedExternal = <any> 'received-external',
        Sent = <any> 'sent',
        SentInternal = <any> 'sent-internal',
        SentExternal = <any> 'sent-external',
        Hedging = <any> 'hedging',
        All = <any> 'all'
    }
}
/**
 * 
 * @export
 * @interface RequestBodyUserBlockedList
 */
export interface RequestBodyUserBlockedList {
    /**
     * Requested page, by default is 1.
     * @type {number}
     * @memberof RequestBodyUserBlockedList
     */
    page?: number;
}
/**
 * 
 * @export
 * @interface RequestBodyUserInfo
 */
export interface RequestBodyUserInfo {
    /**
     * Username of the user.
     * @type {string}
     * @memberof RequestBodyUserInfo
     */
    username: string;
}
/**
 * 
 * @export
 * @interface RequestBodyWalletBalance
 */
export interface RequestBodyWalletBalance {
    /**
     * Cryptocurrency code of balance. By default - BTC. For a list of current supported cryptocurrencies please refer to crypto/list endpoint.
     * @type {string}
     * @memberof RequestBodyWalletBalance
     */
    cryptoCurrencyCode?: string;
}
/**
 * 
 * @export
 * @interface RequestBodyWalletConversionQuotes
 */
export interface RequestBodyWalletConversionQuotes {
    /**
     * Cryptocurrency to convert to. For a list of current supported cryptocurrencies please refer to crypto/list endpoint.
     * @type {string}
     * @memberof RequestBodyWalletConversionQuotes
     */
    convertTo?: string;
    /**
     * Cryptocurrency to convert from. For a list of current supported cryptocurrencies please refer to crypto/list endpoint.
     * @type {string}
     * @memberof RequestBodyWalletConversionQuotes
     */
    convertFrom?: string;
}
/**
 * 
 * @export
 * @interface RequestBodyWalletConvert
 */
export interface RequestBodyWalletConvert {
    /**
     * Amount to convert in cryptocurrency. For BTC in Satoshi, for ETH in GWEI, for USDT in micro cents, e.g. 1 USDT = 1000000 micro cents.
     * @type {number}
     * @memberof RequestBodyWalletConvert
     */
    amount: number;
    /**
     * Unique ID (UUID) of the conversion, that your application needs to generate. Having this parameter ensures idempotency of the operation - you can invoke the endpoint as many times with the same parameter, but conversion will be executed only once. This helps to avoid accidental double conversions.
     * @type {string}
     * @memberof RequestBodyWalletConvert
     */
    orderId: string;
    /**
     * Value for this field can be fetched using wallet/conversion-quotes endpoint.
     * @type {string}
     * @memberof RequestBodyWalletConvert
     */
    quoteId: string;
    /**
     * Cryptocurrency to convert to. For a list of current supported cryptocurrencies please refer to crypto/list endpoint.
     * @type {string}
     * @memberof RequestBodyWalletConvert
     */
    convertTo: string;
    /**
     * Cryptocurrency to convert from. For a list of current supported cryptocurrencies please refer to crypto/list endpoint.
     * @type {string}
     * @memberof RequestBodyWalletConvert
     */
    convertFrom: string;
}
/**
 * 
 * @export
 * @interface RequestBodyWalletListAddresses
 */
export interface RequestBodyWalletListAddresses {
    /**
     * Cryptocurrency code of the wallet addresses. By default - BTC. For a list of current supported cryptocurrencies please refer to crypto/list endpoint.
     * @type {string}
     * @memberof RequestBodyWalletListAddresses
     */
    cryptoCurrencyCode?: string;
}
/**
 * 
 * @export
 * @interface ResponseParamTradeHash
 */
export interface ResponseParamTradeHash {
    /**
     * This parameter will only be available when working with 'trade.chat.bank_account' webhook. When invoking bank-account/get this parameter will be missing from the response.
     * @type {string}
     * @memberof ResponseParamTradeHash
     */
    tradeHash?: string;
}
/**
 * 
 * @export
 * @interface SuccessResponse
 */
export interface SuccessResponse {
    /**
     * 
     * @type {any}
     * @memberof SuccessResponse
     */
    data?: any;
    /**
     * Will have value 'success' if the request is successful, otherwise - 'error'.
     * @type {string}
     * @memberof SuccessResponse
     */
    status?: string;
    /**
     * Timestamp when request has been received and acknowledged by the server.
     * @type {number}
     * @memberof SuccessResponse
     */
    timestamp?: number;
}
/**
 * 
 * @export
 * @interface SuccessTrueResponse
 */
export interface SuccessTrueResponse extends SuccessResponse {
    /**
     * 
     * @type {SuccessTrueResponseData}
     * @memberof SuccessTrueResponse
     */
    data?: SuccessTrueResponseData;
}
/**
 * 
 * @export
 * @interface SuccessTrueResponseData
 */
export interface SuccessTrueResponseData {
    /**
     * True or false, whether the request was successful.
     * @type {boolean}
     * @memberof SuccessTrueResponseData
     */
    success?: boolean;
}
/**
 * 
 * @export
 * @interface TradeAddproofBody
 */
export interface TradeAddproofBody extends RequestBodyTradeAddProof {
    /**
     * A hash (ID) of the trade.
     * @type {string}
     * @memberof TradeAddproofBody
     */
    tradeHash: string;
}
/**
 * 
 * @export
 * @interface TradeChatAddResponse
 */
export interface TradeChatAddResponse {
    /**
     * ID of the message.
     * @type {string}
     * @memberof TradeChatAddResponse
     */
    id?: string;
    /**
     * True or false, whether the request was successful.
     * @type {boolean}
     * @memberof TradeChatAddResponse
     */
    success?: boolean;
}
/**
 * 
 * @export
 * @interface TradeChatAttachment
 */
export interface TradeChatAttachment {
    /**
     * Username of an author of an attachment.
     * @type {string}
     * @memberof TradeChatAttachment
     */
    author?: string;
    /**
     * ID of an attachment.
     * @type {string}
     * @memberof TradeChatAttachment
     */
    imageHash?: string;
}
/**
 * 
 * @export
 * @interface TradeChatGetResponse
 */
export interface TradeChatGetResponse {
    /**
     * Array of messages with keys 'text', 'timestamp', 'type' and 'user_id' if its a reply from user.
     * @type {Array<TradeChatMessage>}
     * @memberof TradeChatGetResponse
     */
    messages?: Array<TradeChatMessage>;
    /**
     * Array of attachments in trade, contains either image_hash or url properties. For image_hash property check docs for endpoint trade-chat/image.
     * @type {Array<TradeChatAttachment>}
     * @memberof TradeChatGetResponse
     */
    attachments?: Array<TradeChatAttachment>;
}
/**
 * 
 * @export
 * @interface TradeChatLatestResponse
 */
export interface TradeChatLatestResponse {
    /**
     * Total number of active trades.
     * @type {number}
     * @memberof TradeChatLatestResponse
     */
    count?: number;
    /**
     * 
     * @type {TradeChatLatestResponseTrades}
     * @memberof TradeChatLatestResponse
     */
    trades?: TradeChatLatestResponseTrades;
}
/**
 * 
 * @export
 * @interface TradeChatLatestResponseTrades
 */
export interface TradeChatLatestResponseTrades {
    /**
     * 
     * @type {TradeChatLatestResponseTradesTradeHash}
     * @memberof TradeChatLatestResponseTrades
     */
    tradeHash?: TradeChatLatestResponseTradesTradeHash;
}
/**
 * 
 * @export
 * @interface TradeChatLatestResponseTradesTradeHash
 */
export interface TradeChatLatestResponseTradesTradeHash {
    /**
     * Array of messages with keys 'text', 'timestamp', 'type' and 'user_id' if its a reply from user.
     * @type {Array<TradeChatMessage>}
     * @memberof TradeChatLatestResponseTradesTradeHash
     */
    messages?: Array<TradeChatMessage>;
    /**
     * Array of attachments in trade, contains either image_hash or url properties. For image_hash property check docs for endpoint trade-chat/image.
     * @type {Array<TradeChatAttachment>}
     * @memberof TradeChatLatestResponseTradesTradeHash
     */
    attachments?: Array<TradeChatAttachment>;
}
/**
 * 
 * @export
 * @interface TradeChatMessage
 */
export interface TradeChatMessage {
    /**
     * ID of a message.
     * @type {string}
     * @memberof TradeChatMessage
     */
    id?: string;
    /**
     * Text of a message.
     * @type {string}
     * @memberof TradeChatMessage
     */
    text?: string;
    /**
     * Type of the message. Possible values: 'msg', 'bank-account', 'online-wallet-qr-code', 'trade_attach_uploaded'.
     * @type {string}
     * @memberof TradeChatMessage
     */
    type?: string;
    /**
     * Username of an author of a message.
     * @type {string}
     * @memberof TradeChatMessage
     */
    author?: string;
    /**
     * Timestamp when author sent a message.
     * @type {number}
     * @memberof TradeChatMessage
     */
    timestamp?: number;
    /**
     * A hash (ID) of the trade.
     * @type {string}
     * @memberof TradeChatMessage
     */
    tradeHash?: string;
    /**
     * A unique identifier of an author of a message.
     * @type {string}
     * @memberof TradeChatMessage
     */
    authorUuid?: string;
    /**
     * When a dispute is started, each trade partner has an option to share attachments for a moderator only. If the trade partner chooses this option and shares the attachment to a moderator only, the parameter value is TRUE. Otherwise, it's FALSE.
     * @type {boolean}
     * @memberof TradeChatMessage
     */
    isForModerator?: boolean;
    /**
     * If the message is sent by the moderator (admin), the parameter value is TRUE. Otherwise, it’s FALSE.
     * @type {boolean}
     * @memberof TradeChatMessage
     */
    sentByModerator?: boolean;
    /**
     * 
     * @type {TradeChatMessageSecurityAwareness}
     * @memberof TradeChatMessage
     */
    securityAwareness?: TradeChatMessageSecurityAwareness;
}
/**
 * When a trade partner sends a message that the system considers as potentially risky, the system marks a message or attachment with a security icon or sends a security message (e.g. if a trade partner sends a third-party link).
 * @export
 * @interface TradeChatMessageSecurityAwareness
 */
export interface TradeChatMessageSecurityAwareness {
    /**
     * A security awareness type, e.g. phishing_awareness
     * @type {string}
     * @memberof TradeChatMessageSecurityAwareness
     */
    type?: string;
    /**
     * A user message type, e.g. moderator_msg, obvious_link, attachment.
     * @type {string}
     * @memberof TradeChatMessageSecurityAwareness
     */
    messageType?: string;
}
/**
 * 
 * @export
 * @interface TradeCompleted
 */
export interface TradeCompleted {
    /**
     * Buyer's username.
     * @type {string}
     * @memberof TradeCompleted
     */
    buyer?: string;
    /**
     * Seller's username.
     * @type {string}
     * @memberof TradeCompleted
     */
    seller?: string;
    /**
     * Status of a trade, e.g. 'successful'.
     * @type {string}
     * @memberof TradeCompleted
     */
    status?: TradeCompleted.StatusEnum;
    /**
     * Time when the trade has been ended (cancelled or completed) in daytime format, e.g. '2021-07-07 14:34:25'.
     * @type {string}
     * @memberof TradeCompleted
     */
    endedAt?: string;
    /**
     * A hash (ID) of the offer
     * @type {string}
     * @memberof TradeCompleted
     */
    offerHash?: string;
    /**
     * An offer type. Possible values: 'buy', 'sell'.
     * @type {string}
     * @memberof TradeCompleted
     */
    offerType?: TradeCompleted.OfferTypeEnum;
    /**
     * Time when the trade has been started in daytime format, e.g. '2021-07-07 14:34:25'.
     * @type {string}
     * @memberof TradeCompleted
     */
    startedAt?: string;
    /**
     * A hash (ID) of the trade.
     * @type {string}
     * @memberof TradeCompleted
     */
    tradeHash?: string;
    /**
     * Time when the trade has been completed in daytime format,  e.g. '2021-07-07 14:34:25'.
     * @type {string}
     * @memberof TradeCompleted
     */
    completedAt?: string;
    /**
     * 3 letter ISO code for fiat currency. For example USD.
     * @type {string}
     * @memberof TradeCompleted
     */
    fiatCurrencyCode?: string;
    /**
     * A name of the payment method.
     * @type {string}
     * @memberof TradeCompleted
     */
    paymentMethodName?: string;
    /**
     * Code of the crypto currency, e.g. BTC.
     * @type {string}
     * @memberof TradeCompleted
     */
    cryptoCurrencyCode?: string;
    /**
     * Total trading amount including fee in fiat.
     * @type {number}
     * @memberof TradeCompleted
     */
    fiatAmountRequested?: number;
    /**
     * Trading amount after payment of fee in crypto currency. For BTC trade in Satoshi, for ETH trade in GWEI, for USDT trade in micro cents, e.g. 1 usdt = 1000000 micro cents.
     * @type {number}
     * @memberof TradeCompleted
     */
    cryptoAmountRequested?: number;
}

/**
 * @export
 * @namespace TradeCompleted
 */
export namespace TradeCompleted {
    /**
     * @export
     * @enum {string}
     */
    export enum StatusEnum {
        Successful = <any> 'successful',
        Cancelled = <any> 'cancelled',
        Expired = <any> 'expired',
        Dispute = <any> 'dispute',
        AwardedSeller = <any> 'awarded seller',
        AwardedBuyer = <any> 'awarded buyer'
    }
    /**
     * @export
     * @enum {string}
     */
    export enum OfferTypeEnum {
        Sell = <any> 'sell',
        Buy = <any> 'buy'
    }
}
/**
 * 
 * @export
 * @interface TradeCompletedResponse
 */
export interface TradeCompletedResponse {
    /**
     * Current page.
     * @type {number}
     * @memberof TradeCompletedResponse
     */
    page?: number;
    /**
     * Number of returned completed trades.
     * @type {number}
     * @memberof TradeCompletedResponse
     */
    count?: number;
    /**
     * 
     * @type {Array<TradeCompleted>}
     * @memberof TradeCompletedResponse
     */
    trades?: Array<TradeCompleted>;
}
/**
 * 
 * @export
 * @interface TradeDisputeReason
 */
export interface TradeDisputeReason {
    /**
     * Dispute reason name.
     * @type {string}
     * @memberof TradeDisputeReason
     */
    name?: string;
    /**
     * Description of the dispute reason.
     * @type {string}
     * @memberof TradeDisputeReason
     */
    description?: string;
    /**
     * Slug of the dispute reason.
     * @type {string}
     * @memberof TradeDisputeReason
     */
    reasonType?: string;
    /**
     * Localized dispute reason name based on the user's locale.
     * @type {string}
     * @memberof TradeDisputeReason
     */
    nameLocalized?: string;
}
/**
 * 
 * @export
 * @interface TradeDisputeReasonsResponse
 */
export interface TradeDisputeReasonsResponse {
    /**
     * Number of returned reasons.
     * @type {number}
     * @memberof TradeDisputeReasonsResponse
     */
    count?: number;
    /**
     * 
     * @type {Array<TradeDisputeReason>}
     * @memberof TradeDisputeReasonsResponse
     */
    reasons?: Array<TradeDisputeReason>;
}
/**
 * 
 * @export
 * @interface TradeGetResponse
 */
export interface TradeGetResponse {
    /**
     * 
     * @type {TradeObject}
     * @memberof TradeGetResponse
     */
    trade?: TradeObject;
    /**
     * A list of available actions for a user (buyer/seller) depending on a trade status.
     * @type {Array<string>}
     * @memberof TradeGetResponse
     */
    supportedActions?: Array<string>;
}
/**
 * 
 * @export
 * @interface TradeList
 */
export interface TradeList {
    /**
     * A hash (ID) of the offer.
     * @type {string}
     * @memberof TradeList
     */
    offerHash?: string;
    /**
     * An offer type. Possible values: 'buy', 'sell'.
     * @type {string}
     * @memberof TradeList
     */
    offerType?: TradeList.OfferTypeEnum;
    /**
     * Time when the trade was started in daytime format, e.g. '2021-07-07 14:34:25'.
     * @type {string}
     * @memberof TradeList
     */
    startedAt?: string;
    /**
     * A hash (ID) of the trade.
     * @type {string}
     * @memberof TradeList
     */
    tradeHash?: string;
    /**
     * Number of attachments in the trade chat.
     * @type {number}
     * @memberof TradeList
     */
    totalAttachments?: number;
    /**
     * 3 letter ISO code for fiat currency, e.g. USD.
     * @type {string}
     * @memberof TradeList
     */
    fiatCurrencyCode?: string;
    /**
     * Code of the crypto currency, e.g. BTC.
     * @type {string}
     * @memberof TradeList
     */
    cryptoCurrencyCode?: string;
}

/**
 * @export
 * @namespace TradeList
 */
export namespace TradeList {
    /**
     * @export
     * @enum {string}
     */
    export enum OfferTypeEnum {
        Sell = <any> 'sell',
        Buy = <any> 'buy'
    }
}
/**
 * 
 * @export
 * @interface TradeListResponse
 */
export interface TradeListResponse {
    /**
     * Number of returned active trades.
     * @type {number}
     * @memberof TradeListResponse
     */
    count?: number;
    /**
     * 
     * @type {Array<TradeList>}
     * @memberof TradeListResponse
     */
    trades?: Array<TradeList>;
}
/**
 * 
 * @export
 * @interface TradeLocation
 */
export interface TradeLocation {
    /**
     * ISO country code.
     * @type {string}
     * @memberof TradeLocation
     */
    iso?: string;
    /**
     * Country name.
     * @type {string}
     * @memberof TradeLocation
     */
    name?: string;
    /**
     * Localized country name.
     * @type {string}
     * @memberof TradeLocation
     */
    localizedName?: string;
}
/**
 * 
 * @export
 * @interface TradeLocations
 */
export interface TradeLocations {
    /**
     * 
     * @type {TradeLocation}
     * @memberof TradeLocations
     */
    ipLocation?: TradeLocation;
    /**
     * 
     * @type {TradeLocation}
     * @memberof TradeLocations
     */
    detectedLocation?: TradeLocation;
}
/**
 * 
 * @export
 * @interface TradeLocationsResponse
 */
export interface TradeLocationsResponse {
    /**
     * 
     * @type {TradeLocations}
     * @memberof TradeLocationsResponse
     */
    buyer?: TradeLocations;
    /**
     * 
     * @type {TradeLocations}
     * @memberof TradeLocationsResponse
     */
    seller?: TradeLocations;
}
/**
 * 
 * @export
 * @interface TradeObject
 */
export interface TradeObject {
    /**
     * A percent that determines differences between market price and the price of the offer.
     * @type {number}
     * @memberof TradeObject
     */
    margin?: number;
    /**
     * Returns a time when the buyer markes trade as 'Paid' in daytime format, e.g. '2021-07-07 14:34:25'.
     * @type {string}
     * @memberof TradeObject
     */
    paidAt?: string;
    /**
     * IP of the offer owner.
     * @type {string}
     * @memberof TradeObject
     */
    ownerIp?: string;
    /**
     * If TRUE then trade was reopened.
     * @type {boolean}
     * @memberof TradeObject
     */
    reopened?: boolean;
    /**
     * Deprecated, use 'flow_type_slug' instead. Possible values: null (default classic), 1 (lite), 2 (gift card automated).
     * @type {number}
     * @memberof TradeObject
     */
    flowType?: number;
    /**
     * Deprecated, use 'source_slug' instead. Code of a source where trade has been started. Possible values: 1 (basic trade), 2 (kiosk widget).
     * @type {number}
     * @memberof TradeObject
     */
    sourceId?: number;
    /**
     * Buyer's username.
     * @type {string}
     * @memberof TradeObject
     */
    buyerName?: string;
    /**
     * A hash (ID) of the offer.
     * @type {string}
     * @memberof TradeObject
     */
    offerHash?: string;
    /**
     * An offer type. Possible values: 'buy', 'sell'.
     * @type {string}
     * @memberof TradeObject
     */
    offerType?: TradeObject.OfferTypeEnum;
    /**
     * Time when the trade was started in daytime format, e.g. '2021-07-07 14:34:25'.
     * @type {string}
     * @memberof TradeObject
     */
    startedAt?: string;
    /**
     * A hash (ID) of the trade.
     * @type {string}
     * @memberof TradeObject
     */
    tradeHash?: string;
    /**
     * Terms of the offer for a trade partner.
     * @type {string}
     * @memberof TradeObject
     */
    offerTerms?: string;
    /**
     * Seller's username.
     * @type {string}
     * @memberof TradeObject
     */
    sellerName?: string;
    /**
     * Slug of a source where trade has been started. Possible values: main (basic trade), freeway (kiosk widget).
     * @type {string}
     * @memberof TradeObject
     */
    sourceSlug?: TradeObject.SourceSlugEnum;
    /**
     * Time when the trade was cancelled in daytime format, e.g. '2021-07-07 14:34:25'.
     * @type {string}
     * @memberof TradeObject
     */
    cancelledAt?: string;
    /**
     * Time when the trade was completed in daytime format, e.g. '2021-07-07 14:34:25'.
     * @type {string}
     * @memberof TradeObject
     */
    completedAt?: string;
    /**
     * A trade partner IP.
     * @type {string}
     * @memberof TradeObject
     */
    responderIp?: string;
    /**
     * Returns a status of the trade, e.g. Paid, Released.
     * @type {string}
     * @memberof TradeObject
     */
    tradeStatus?: TradeObject.TradeStatusEnum;
    /**
     * Bank accounts that will be used for a given trade.
     * @type {Array<TradeObjectBankAccounts>}
     * @memberof TradeObject
     */
    bankAccounts?: Array<TradeObjectBankAccounts>;
    /**
     * Instructions for a trade partner.
     * @type {string}
     * @memberof TradeObject
     */
    tradeDetails?: string;
    /**
     * Buyer's fee percentage.
     * @type {number}
     * @memberof TradeObject
     */
    feePercentage?: number;
    /**
     * Trade flow type. Possible values: default, lite, gcc (gift card automated).
     * @type {string}
     * @memberof TradeObject
     */
    flowTypeSlug?: TradeObject.FlowTypeSlugEnum;
    /**
     * How much time the trade partner has to make the payment and click 'Paid' before the trade is automatically canceled.
     * @type {number}
     * @memberof TradeObject
     */
    paymentWindow?: number;
    /**
     * 
     * @type {TradeObjectBuyerFullName}
     * @memberof TradeObject
     */
    buyerFullName?: TradeObjectBuyerFullName;
    /**
     * If TRUE then funds successfully have been escrowed.
     * @type {boolean}
     * @memberof TradeObject
     */
    instantFunding?: boolean;
    /**
     * Time when the dispute has ended in daytime format, e.g. '2021-07-07 14:34:25'.
     * @type {string}
     * @memberof TradeObject
     */
    disputeEndedAt?: string;
    /**
     * Time when the funds have been escrowed in daytime format, e.g. '2021-07-07 14:34:25'.
     * @type {string}
     * @memberof TradeObject
     */
    escrowFundedAt?: string;
    /**
     * 
     * @type {TradeObjectSellerFullName}
     * @memberof TradeObject
     */
    sellerFullName?: TradeObjectSellerFullName;
    /**
     * Buyer's external id (UID).
     * @type {string}
     * @memberof TradeObject
     */
    buyerExternalId?: string;
    /**
     * Total fee of the offer in Satoshi. If offer happens to be in crypto other than BTC, then fee is going to be recalculated in Satoshi.
     * @type {number}
     * @memberof TradeObject
     */
    feeCryptoAmount?: number;
    /**
     * Number of attachments in the trade chat.
     * @type {number}
     * @memberof TradeObject
     */
    totalAttachments?: number;
    /**
     * Time when the dispute has been started in daytime format, e.g. '2021-07-07 14:34:25'.
     * @type {string}
     * @memberof TradeObject
     */
    disputeStartedAt?: string;
    /**
     * 3 letter ISO code for fiat currency, e.g. USD.
     * @type {string}
     * @memberof TradeObject
     */
    fiatCurrencyCode?: string;
    /**
     * Deprecated. Use 'fiat_price_per_crypto' and 'crypto_currency_code'. Fiat price of the offer per BTC (taken from the offer page).
     * @type {number}
     * @memberof TradeObject
     */
    fiatPricePerBtc?: number;
    /**
     * Time when a deferred escrow has started.
     * @type {string}
     * @memberof TradeObject
     */
    fundingStartedAt?: string;
    /**
     * Time when an owner of the offer opened chat for the first time for the current trade.
     * @type {string}
     * @memberof TradeObject
     */
    ownerRespondedAt?: string;
    /**
     * Seller's external id (UID).
     * @type {string}
     * @memberof TradeObject
     */
    sellerExternalId?: string;
    /**
     * Buyer's phone carrier name.
     * @type {string}
     * @memberof TradeObject
     */
    buyerPhoneCarrier?: string;
    /**
     * Buyer's country name.
     * @type {string}
     * @memberof TradeObject
     */
    buyerPhoneCountry?: string;
    /**
     * Total trading amount including fee in satoshi.
     * @type {number}
     * @memberof TradeObject
     */
    cryptoAmountTotal?: number;
    /**
     * A name of the payment method.
     * @type {string}
     * @memberof TradeObject
     */
    paymentMethodName?: string;
    /**
     * A slug of the payment method.
     * @type {string}
     * @memberof TradeObject
     */
    paymentMethodSlug?: string;
    /**
     * Buyer's fee percentage.
     * @type {number}
     * @memberof TradeObject
     */
    buyerFeePercentage?: number;
    /**
     * Code of the crypto currency. For example BTC.
     * @type {string}
     * @memberof TradeObject
     */
    cryptoCurrencyCode?: string;
    /**
     * External description from Kiosk widget.
     * @type {string}
     * @memberof TradeObject
     */
    externalDescription?: string;
    /**
     * Time when a deferred escrow has completed.
     * @type {string}
     * @memberof TradeObject
     */
    fundingCompletedAt?: string;
    /**
     * Seller's phone carrier name.
     * @type {string}
     * @memberof TradeObject
     */
    sellerPhoneCarrier?: string;
    /**
     * Seller's country name.
     * @type {string}
     * @memberof TradeObject
     */
    sellerPhoneCountry?: string;
    /**
     * Total trading amount including fee in fiat.
     * @type {number}
     * @memberof TradeObject
     */
    fiatAmountRequested?: number;
    /**
     * Fiat price of the offer per crypto.
     * @type {number}
     * @memberof TradeObject
     */
    fiatPricePerCrypto?: number;
    /**
     * Seller's fee percentage.
     * @type {number}
     * @memberof TradeObject
     */
    sellerFeePercentage?: number;
    /**
     * Buyer's fee in crypto currency. For BTC trade in Satoshi, for ETH trade in GWEI, for USDT trade in micro cents, e.g. 1 usdt = 1000000 micro cents.
     * @type {number}
     * @memberof TradeObject
     */
    buyerFeeCryptoAmount?: number;
    /**
     * Trading amount after payment of fee in crypto currency. For BTC trade in Satoshi, for ETH trade in GWEI, for USDT trade in micro cents, e.g. 1 usdt = 1000000 micro cents.
     * @type {number}
     * @memberof TradeObject
     */
    cryptoAmountRequested?: number;
    /**
     * Rate of crypto in USD of this trade.
     * @type {number}
     * @memberof TradeObject
     */
    cryptoCurrentRateUsd?: number;
    /**
     * External crypto address. Only for Kiosk widget.
     * @type {string}
     * @memberof TradeObject
     */
    externalCryptoAddress?: string;
    /**
     * Date of creation of buyer's Paxful account in daytime format, e.g. '2021-07-07 14:34:25'.
     * @type {string}
     * @memberof TradeObject
     */
    buyerAccountCreatedAt?: string;
    /**
     * Seller's fee in crypto currency. For BTC trade in Satoshi, for ETH trade in GWEI, for USDT trade in micro cents, e.g. 1 usdt = 1000000 micro cents.
     * @type {number}
     * @memberof TradeObject
     */
    sellerFeeCryptoAmount?: number;
    /**
     * Date of creation of seller's Paxful account in daytime format, e.g. '2021-07-07 14:34:25'.
     * @type {string}
     * @memberof TradeObject
     */
    sellerAccountCreatedAt?: string;
}

/**
 * @export
 * @namespace TradeObject
 */
export namespace TradeObject {
    /**
     * @export
     * @enum {string}
     */
    export enum OfferTypeEnum {
        Sell = <any> 'sell',
        Buy = <any> 'buy'
    }
    /**
     * @export
     * @enum {string}
     */
    export enum SourceSlugEnum {
        Main = <any> 'main',
        Freeway = <any> 'freeway'
    }
    /**
     * @export
     * @enum {string}
     */
    export enum TradeStatusEnum {
        NotFunded = <any> 'Not funded',
        FundsProcessing = <any> 'Funds processing',
        FundsProcessed = <any> 'Funds processed',
        ActiveFunded = <any> 'Active funded',
        Paid = <any> 'Paid',
        CancelledSystem = <any> 'Cancelled system',
        CancelledBuyer = <any> 'Cancelled buyer',
        CancelledSeller = <any> 'Cancelled seller',
        Released = <any> 'Released',
        DisputeOpen = <any> 'Dispute open',
        DisputeWinsSeller = <any> 'Dispute wins seller',
        DisputeWinsBuyer = <any> 'Dispute wins buyer'
    }
    /**
     * @export
     * @enum {string}
     */
    export enum FlowTypeSlugEnum {
        Default = <any> 'default',
        Lite = <any> 'lite',
        Gcc = <any> 'gcc'
    }
}
/**
 * 
 * @export
 * @interface TradeObjectBankAccounts
 */
export interface TradeObjectBankAccounts {
    /**
     * Bank account to which money will be transferred.
     * @type {Array<BankAccountResponse>}
     * @memberof TradeObjectBankAccounts
     */
    to?: Array<BankAccountResponse>;
    /**
     * Bank account from which money will be transferred.
     * @type {Array<BankAccountResponse>}
     * @memberof TradeObjectBankAccounts
     */
    from?: Array<BankAccountResponse>;
}
/**
 * 
 * @export
 * @interface TradeObjectBuyerFullName
 */
export interface TradeObjectBuyerFullName {
    /**
     * Buyer's last name.
     * @type {string}
     * @memberof TradeObjectBuyerFullName
     */
    lastName?: string;
    /**
     * Buyer's first name.
     * @type {string}
     * @memberof TradeObjectBuyerFullName
     */
    firstName?: string;
}
/**
 * 
 * @export
 * @interface TradeObjectSellerFullName
 */
export interface TradeObjectSellerFullName {
    /**
     * Seller's last name.
     * @type {string}
     * @memberof TradeObjectSellerFullName
     */
    lastName?: string;
    /**
     * Seller's first name.
     * @type {string}
     * @memberof TradeObjectSellerFullName
     */
    firstName?: string;
}
/**
 * 
 * @export
 * @interface TradeStartResponse
 */
export interface TradeStartResponse {
    /**
     * TRUE or FALSE, whether the request was successful.
     * @type {boolean}
     * @memberof TradeStartResponse
     */
    success?: boolean;
    /**
     * A hash (ID) of the trade.
     * @type {string}
     * @memberof TradeStartResponse
     */
    tradeHash?: string;
}
/**
 * 
 * @export
 * @interface TradeUsebankaccountBody
 */
export interface TradeUsebankaccountBody extends RequestBodyBankAccountId {
    /**
     * A hash (ID) of the trade.
     * @type {string}
     * @memberof TradeUsebankaccountBody
     */
    tradeHash: string;
}
/**
 * 
 * @export
 * @interface Transaction
 */
export interface Transaction {
    /**
     * Deprecated field, use amount_crypto_full instead.
     * @type {string}
     * @memberof Transaction
     */
    btc?: string;
    /**
     * Time when transaction has been made.
     * @type {string}
     * @memberof Transaction
     */
    time?: string;
    /**
     * Localized type name of the transaction, e.g. 'Escrow release'.
     * @type {string}
     * @memberof Transaction
     */
    type?: string;
    /**
     * Deprecated field. Please refer to transaction_id.
     * @type {string}
     * @memberof Transaction
     */
    txId?: string;
    /**
     * Wallet address where crypto has been sent to.
     * @type {string}
     * @memberof Transaction
     */
    sentTo?: string;
    /**
     * User note from transaction history. Being on marketplace (https://paxful.com/account/transactions) a user is able to leave notes to certain transactions. If such were left, then they will be returned in this field.
     * @type {string}
     * @memberof Transaction
     */
    userNote?: string;
    /**
     * Blockchain type. Some possible values: 'bitcoin', 'tron', 'ethereum'.
     * @type {string}
     * @memberof Transaction
     */
    blockchain?: Transaction.BlockchainEnum;
    /**
     * A hash (ID) of the trade.
     * @type {string}
     * @memberof Transaction
     */
    tradeHash?: string;
    /**
     * Fiat amount of transaction.
     * @type {string}
     * @memberof Transaction
     */
    amountFiat?: string;
    /**
     * Balance after transaction in USD.
     * @type {string}
     * @memberof Transaction
     */
    balanceUsd?: string;
    /**
     * Recipient username (in case of internal transactions, i.e. between two Paxful users).
     * @type {string}
     * @memberof Transaction
     */
    sentToUser?: string;
    /**
     * Crypto amount of transaction. For BTC in Satoshi, for ETH in GWEI, for USDT in micro cents, e.g. 1 USDT = 1000000 micro cents.
     * @type {number}
     * @memberof Transaction
     */
    amountCrypto?: number;
    /**
     * A hash (ID) of the transaction.
     * @type {string}
     * @memberof Transaction
     */
    transactionId?: string;
    /**
     * Crypto amount of transaction in BTC, USDT, ETH. A decimal number. For a value in 'cents' see 'amount_crypto'.
     * @type {string}
     * @memberof Transaction
     */
    amountCryptoFull?: string;
    /**
     * 3 letter ISO code for fiat currency, e.g. USD.
     * @type {string}
     * @memberof Transaction
     */
    fiatCurrencyCode?: string;
    /**
     * Balance after transaction in cryptocurrency. For BTC in Satoshi, for ETH in GWEI, for USDT in micro cents, e.g. 1 USDT = 1000000 micro cents.
     * @type {number}
     * @memberof Transaction
     */
    newCryptoBalance?: number;
    /**
     * Sender username (in case of internal transactions, i.e. between two Paxful users).
     * @type {string}
     * @memberof Transaction
     */
    receivedFromUser?: string;
    /**
     * 3 letter ISO code for cryptocurrency, e.g. BTC.
     * @type {string}
     * @memberof Transaction
     */
    cryptoCurrencyCode?: string;
    /**
     * Balance changes. For BTC in Satoshi, for ETH in GWEI, for USDT in micro cents, e.g. 1 USDT = 1000000 micro cents.
     * @type {number}
     * @memberof Transaction
     */
    cryptoAddToBalance?: number;
}

/**
 * @export
 * @namespace Transaction
 */
export namespace Transaction {
    /**
     * @export
     * @enum {string}
     */
    export enum BlockchainEnum {
        Bitcoin = <any> 'bitcoin',
        Tron = <any> 'tron',
        Ethereum = <any> 'ethereum'
    }
}
/**
 * 
 * @export
 * @interface TransactionsAllResponse
 */
export interface TransactionsAllResponse {
    /**
     * Current page.
     * @type {number}
     * @memberof TransactionsAllResponse
     */
    page?: number;
    /**
     * A number of transactions in the current page.
     * @type {number}
     * @memberof TransactionsAllResponse
     */
    count?: number;
    /**
     * Array of transactions objects.
     * @type {Array<Transaction>}
     * @memberof TransactionsAllResponse
     */
    transactions?: Array<Transaction>;
}
/**
 * 
 * @export
 * @interface UserAffiliateResponse
 */
export interface UserAffiliateResponse {
    /**
     * 
     * @type {UserAffiliateResponseAffiliatesCount}
     * @memberof UserAffiliateResponse
     */
    affiliatesCount?: UserAffiliateResponseAffiliatesCount;
    /**
     * Affiliate balance in fiat currency.
     * @type {string}
     * @memberof UserAffiliateResponse
     */
    affiliateBalance?: string;
    /**
     * 3 letter ISO code for fiat currency, e.g 'USD'.
     * @type {string}
     * @memberof UserAffiliateResponse
     */
    fiatCurrencyCode?: string;
}
/**
 * 
 * @export
 * @interface UserAffiliateResponseAffiliatesCount
 */
export interface UserAffiliateResponseAffiliatesCount {
    /**
     * Number of affiliates tier 1.
     * @type {number}
     * @memberof UserAffiliateResponseAffiliatesCount
     */
    tier1?: number;
    /**
     * Number of affiliates tier 2.
     * @type {number}
     * @memberof UserAffiliateResponseAffiliatesCount
     */
    tier2?: number;
}
/**
 * 
 * @export
 * @interface UserBlockedList
 */
export interface UserBlockedList {
    /**
     * Username of the blocked user.
     * @type {string}
     * @memberof UserBlockedList
     */
    username?: string;
    /**
     * Full URL of the blocked user avatar image.
     * @type {string}
     * @memberof UserBlockedList
     */
    avatarUrl?: string;
    /**
     * Date when a user has been blocked.
     * @type {string}
     * @memberof UserBlockedList
     */
    blockedAt?: string;
}
/**
 * 
 * @export
 * @interface UserBlockedListResponse
 */
export interface UserBlockedListResponse {
    /**
     * Current page.
     * @type {number}
     * @memberof UserBlockedListResponse
     */
    page?: number;
    /**
     * Number of returned blocked users.
     * @type {number}
     * @memberof UserBlockedListResponse
     */
    count?: number;
    /**
     * 
     * @type {Array<UserBlockedList>}
     * @memberof UserBlockedListResponse
     */
    blockedUsers?: Array<UserBlockedList>;
}
/**
 * 
 * @export
 * @interface UserInfoObject
 */
export interface UserInfoObject {
    /**
     * A unique identifier of a user. User can change his/her username once after registration, hence if you need a reliable identifier of a user that will never be changed then use this parameter.
     * @type {string}
     * @memberof UserInfoObject
     */
    uid?: string;
    /**
     * Time when a user joined, e.g. '3 months ago'.
     * @type {string}
     * @memberof UserInfoObject
     */
    joined?: string;
    /**
     * User current status, e.g. 'active', 'banned', etc.
     * @type {string}
     * @memberof UserInfoObject
     */
    status?: string;
    /**
     * Username.
     * @type {string}
     * @memberof UserInfoObject
     */
    username?: string;
    /**
     * If TRUE, then the user is a vendor (https://paxful.com/vendors).
     * @type {boolean}
     * @memberof UserInfoObject
     */
    isVendor?: boolean;
    /**
     * Time when a user has been seen last time, e.g. 'Seen 2 hours ago'.
     * @type {string}
     * @memberof UserInfoObject
     */
    lastSeen?: string;
    /**
     * Deprecated. Please use 'total_crypto_traded' field. Approximate amount of total traded BTC, e.g. 'Less than 1'.
     * @type {string}
     * @memberof UserInfoObject
     */
    totalBtc?: string;
    /**
     * How many users blocked the current user.
     * @type {number}
     * @memberof UserInfoObject
     */
    blockedBy?: number;
    /**
     * Date of account has been created.
     * @type {string}
     * @memberof UserInfoObject
     */
    createdAt?: string;
    /**
     * Is the user added to your trusted list.
     * @type {boolean}
     * @memberof UserInfoObject
     */
    isTrusted?: boolean;
    /**
     * How many users have added a current user to the trusted list.
     * @type {number}
     * @memberof UserInfoObject
     */
    trustedBy?: number;
    /**
     * If TRUE, then the current user's ID is verified.
     * @type {boolean}
     * @memberof UserInfoObject
     */
    isVerified?: boolean;
    /**
     * Total number of trades.
     * @type {number}
     * @memberof UserInfoObject
     */
    totalTrades?: number;
    /**
     * Deprecated field. Please use 'total_trades'.
     * @type {number}
     * @memberof UserInfoObject
     */
    tradesTotal?: number;
    /**
     * Count of people the user has blocked.
     * @type {number}
     * @memberof UserInfoObject
     */
    blockedCount?: number;
    /**
     * If TRUE, then the current user's email is verified.
     * @type {boolean}
     * @memberof UserInfoObject
     */
    emailVerified?: boolean;
    /**
     * If TRUE, then the current user's phone is verified.
     * @type {boolean}
     * @memberof UserInfoObject
     */
    phoneVerified?: boolean;
    /**
     * Total number of trade partners.
     * @type {number}
     * @memberof UserInfoObject
     */
    totalPartners?: number;
    /**
     * Date of the first completed trade in YYYY-MM-DD format.
     * @type {string}
     * @memberof UserInfoObject
     */
    firstTradeDate?: string;
    /**
     * Total number of negative feedback.
     * @type {number}
     * @memberof UserInfoObject
     */
    feedbackNegative?: number;
    /**
     * Total number of positive feedback.
     * @type {number}
     * @memberof UserInfoObject
     */
    feedbackPositive?: number;
    /**
     * 
     * @type {UserMeObjectTotalCryptoTraded}
     * @memberof UserInfoObject
     */
    totalCryptoTraded?: UserMeObjectTotalCryptoTraded;
    /**
     * A number of trades that you (who is using the API) completed with the given user.
     * @type {number}
     * @memberof UserInfoObject
     */
    completedTradesWithMe?: number;
}
/**
 * 
 * @export
 * @interface UserMeObject
 */
export interface UserMeObject {
    /**
     * A unique identifier of a user. User can change his/her username once after registration, hence if you need a reliable identifier of a user that will never be changed then use this parameter.
     * @type {string}
     * @memberof UserMeObject
     */
    uid?: string;
    /**
     * Time when a user joined, e.g. '3 months ago'.
     * @type {string}
     * @memberof UserMeObject
     */
    joined?: string;
    /**
     * User current status, e.g. 'active', 'banned', etc.
     * @type {string}
     * @memberof UserMeObject
     */
    status?: string;
    /**
     * Username
     * @type {string}
     * @memberof UserMeObject
     */
    username?: string;
    /**
     * If TRUE, then the user is a vendor (https://paxful.com/vendors).
     * @type {boolean}
     * @memberof UserMeObject
     */
    isVendor?: boolean;
    /**
     * Time when a user has been seen last time, e.g. 'Seen 2 hours ago'.
     * @type {string}
     * @memberof UserMeObject
     */
    lastSeen?: string;
    /**
     * Deprecated. Please use 'total_crypto_traded' field. Approximate amount of total traded BTC, e.g. 'Less than 1'.
     * @type {string}
     * @memberof UserMeObject
     */
    totalBtc?: string;
    /**
     * Full URL of a user avatar image.
     * @type {string}
     * @memberof UserMeObject
     */
    avatarUrl?: string;
    /**
     * How many users blocked the current user.
     * @type {number}
     * @memberof UserMeObject
     */
    blockedBy?: number;
    /**
     * How many users have added a current user to the trusted list.
     * @type {number}
     * @memberof UserMeObject
     */
    trustedBy?: number;
    /**
     * If TRUE, then the current user's ID is verified.
     * @type {boolean}
     * @memberof UserMeObject
     */
    isVerified?: boolean;
    /**
     * Total number of trades.
     * @type {number}
     * @memberof UserMeObject
     */
    totalTrades?: number;
    /**
     * Referral user's link.
     * @type {string}
     * @memberof UserMeObject
     */
    referralLink?: string;
    /**
     * If TRUE, then the current user's email is verified.
     * @type {boolean}
     * @memberof UserMeObject
     */
    emailVerified?: boolean;
    /**
     * If TRUE, then the current user's phone is verified.
     * @type {boolean}
     * @memberof UserMeObject
     */
    phoneVerified?: boolean;
    /**
     * Total number of trade partners.
     * @type {number}
     * @memberof UserMeObject
     */
    totalPartners?: number;
    /**
     * Total number of negative feedback.
     * @type {number}
     * @memberof UserMeObject
     */
    feedbackNegative?: number;
    /**
     * Total number of positive feedback.
     * @type {number}
     * @memberof UserMeObject
     */
    feedbackPositive?: number;
    /**
     * 
     * @type {UserMeObjectTotalCryptoTraded}
     * @memberof UserMeObject
     */
    totalCryptoTraded?: UserMeObjectTotalCryptoTraded;
}
/**
 * Approximate amount of total crypto traded.
 * @export
 * @interface UserMeObjectTotalCryptoTraded
 */
export interface UserMeObjectTotalCryptoTraded {
    /**
     * Approximate amount of total traded BTC, e.g. 'Less than 10'.
     * @type {string}
     * @memberof UserMeObjectTotalCryptoTraded
     */
    btc?: string;
    /**
     * Approximate amount of total traded ETH, e.g. 'Less than 10K'.
     * @type {string}
     * @memberof UserMeObjectTotalCryptoTraded
     */
    eth?: string;
    /**
     * Approximate amount of total traded USDT, e.g. 'Less than 10K'.
     * @type {string}
     * @memberof UserMeObjectTotalCryptoTraded
     */
    usdt?: string;
}
/**
 * 
 * @export
 * @interface UserType
 */
export interface UserType {
    /**
     * User type id.
     * @type {number}
     * @memberof UserType
     */
    id?: number;
    /**
     * User type name.
     * @type {string}
     * @memberof UserType
     */
    name?: string;
    /**
     * User type alias.
     * @type {string}
     * @memberof UserType
     */
    alias?: string;
    /**
     * User type description.
     * @type {string}
     * @memberof UserType
     */
    description?: string;
}
/**
 * 
 * @export
 * @interface UserTypesResponse
 */
export interface UserTypesResponse {
    /**
     * Number of returned user types.
     * @type {number}
     * @memberof UserTypesResponse
     */
    count?: number;
    /**
     * Array of available user types.
     * @type {Array<UserType>}
     * @memberof UserTypesResponse
     */
    types?: Array<UserType>;
}
/**
 * 
 * @export
 * @interface WalletBalanceResponse
 */
export interface WalletBalanceResponse {
    /**
     * Currently available user balance in Satoshi for BTC wallet, micro cents for USDT wallet and WEI for ETH wallet.
     * @type {number}
     * @memberof WalletBalanceResponse
     */
    balance?: number;
    /**
     * Balance in escrow. Currently available in Satoshi for BTC wallet, micro cents for USDT wallet and WEI for ETH wallet.
     * @type {number}
     * @memberof WalletBalanceResponse
     */
    balanceEscrow?: number;
    /**
     * Deposit that is currently waiting for a blockchain confirmation.
     * @type {number}
     * @memberof WalletBalanceResponse
     */
    incomingAmount?: number;
    /**
     * Cryptocurrency code of current balance. By default - BTC.
     * @type {string}
     * @memberof WalletBalanceResponse
     */
    cryptoCurrencyCode?: string;
}
/**
 * 
 * @export
 * @interface WalletConversionQuotes
 */
export interface WalletConversionQuotes {
    /**
     * Pair of cryptocurrency conversion codes, e.g. 'BTCETH'.
     * @type {string}
     * @memberof WalletConversionQuotes
     */
    pair?: string;
    /**
     * A unique quote id that should be used when performing conversion using wallet/convert.
     * @type {string}
     * @memberof WalletConversionQuotes
     */
    quoteId?: string;
    /**
     * Active status of the pair. Shows if conversion of the pair is possible.
     * @type {boolean}
     * @memberof WalletConversionQuotes
     */
    isActive?: boolean;
    /**
     * Time when conversion pairs will expire (UTC time). If expired, new quote_id should be requested.
     * @type {string}
     * @memberof WalletConversionQuotes
     */
    expiredTime?: string;
    /**
     * 
     * @type {WalletConversionQuotesConverstionRate}
     * @memberof WalletConversionQuotes
     */
    converstionRate?: WalletConversionQuotesConverstionRate;
}
/**
 * Rate of the conversion pairs.
 * @export
 * @interface WalletConversionQuotesConverstionRate
 */
export interface WalletConversionQuotesConverstionRate {
    /**
     * Amout of the rate.
     * @type {number}
     * @memberof WalletConversionQuotesConverstionRate
     */
    amount?: number;
    /**
     * Cryptocurency code of the conversion.
     * @type {string}
     * @memberof WalletConversionQuotesConverstionRate
     */
    currencyCode?: string;
}
/**
 * 
 * @export
 * @interface WalletConversionQuotesResponse
 */
export interface WalletConversionQuotesResponse {
    /**
     * List of current quotes. All pairs if no request fields are specified.
     * @type {Array<WalletConversionQuotes>}
     * @memberof WalletConversionQuotesResponse
     */
    quotes?: Array<WalletConversionQuotes>;
}
/**
 * 
 * @export
 * @interface WalletConvertResponse
 */
export interface WalletConvertResponse {
    /**
     * Unique ID (UUID) of the conversion that has been used to convert funds.
     * @type {string}
     * @memberof WalletConvertResponse
     */
    orderId?: string;
    /**
     * Amount received after conversion in crypto. For BTC in Satoshi, for ETH in GWEI, for USDT in micro cents, e.g. 1 USDT = 1000000 micro cents.
     * @type {number}
     * @memberof WalletConvertResponse
     */
    convertedToAmount?: number;
    /**
     * Amount of crypto that has been converted. For BTC in Satoshi, for ETH in GWEI, for USDT in micro cents, e.g. 1 USDT = 1000000 micro cents.
     * @type {number}
     * @memberof WalletConvertResponse
     */
    convertedFromAmount?: number;
    /**
     * Cryptocurrency code of received amount. For a list of current supported cryptocurrencies please refer to crypto/list endpoint.
     * @type {string}
     * @memberof WalletConvertResponse
     */
    convertedToCryptoCurrencyCode?: string;
    /**
     * Cryptocurrency code of the amount that has been converted. For a list of current supported cryptocurrencies please refer to crypto/list endpoint.
     * @type {string}
     * @memberof WalletConvertResponse
     */
    convertedFromCryptoCurrencyCode?: string;
}
/**
 * 
 * @export
 * @interface WalletListAddresses
 */
export interface WalletListAddresses {
    /**
     * Wallet address.
     * @type {string}
     * @memberof WalletListAddresses
     */
    address?: string;
    /**
     * Date of the wallet address creation, e.g. '2021-04-29T13:17:15+03:00'.
     * @type {string}
     * @memberof WalletListAddresses
     */
    created?: string;
    /**
     * If true, then this wallet adress is main.
     * @type {boolean}
     * @memberof WalletListAddresses
     */
    isMaster?: boolean;
    /**
     * Crypto amount of external incoming. For BTC in Satoshi, for ETH in GWEI, for USDT in micro cents, e.g. 1 USDT = 1000000 micro cents.
     * @type {number}
     * @memberof WalletListAddresses
     */
    totalReceived?: number;
    /**
     * 3 letter ISO code for cryptocurrency, e.g. BTC.
     * @type {string}
     * @memberof WalletListAddresses
     */
    cryptoCurrencyCode?: string;
}
/**
 * 
 * @export
 * @interface WalletListAddressesResponse
 */
export interface WalletListAddressesResponse {
    /**
     * List of your crypto addresses, 50 limit.
     * @type {Array<WalletListAddresses>}
     * @memberof WalletListAddressesResponse
     */
    addresses?: Array<WalletListAddresses>;
}
/**
 * 
 * @export
 * @interface WalletNewAddressResponse
 */
export interface WalletNewAddressResponse {
    /**
     * Address of newly created wallet.
     * @type {string}
     * @memberof WalletNewAddressResponse
     */
    address?: string;
    /**
     * Wallet cryptocurrency code. At the moment can be only BTC.
     * @type {string}
     * @memberof WalletNewAddressResponse
     */
    cryptoCurrencyCode?: string;
}
/**
 * BankApi - fetch parameter creator
 * @export
 */
export const BankApiFetchParamCreator = {
    /**
     * Fetch all available banks for the specified country.
     * @summary bank/list
     * @param {string} [countryIso] ISO country code of the offer owner.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    bankList(countryIso?: string, options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/bank/list`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (countryIso !== undefined) {
            localVarFormParams.set('country_iso', countryIso as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
};

export type BankApiBankListParams = {
    /**
     * ISO country code of the offer owner.
     */
    countryIso?: string;

}


/**
 * BankApi
 * @export
 * @class BankApi
 * @extends {BaseAPI}
 */
export class BankApi extends BaseAPI {
    /**
     * Fetch all available banks for the specified country.
     * @summary bank/list
     * @param { BankApiBankListParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BankApi
     */
    public list(params?: BankApiBankListParams, options?: any): Promise<InlineResponse2001> {
        const localVarFetchArgs = BankApiFetchParamCreator.bankList(params?.countryIso, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

}
/**
 * BankAccountApi - fetch parameter creator
 * @export
 */
export const BankAccountApiFetchParamCreator = {
    /**
     * Create bank account.
     * @summary bank-account/create
     * @param {string} [iban] IBAN.
     * @param {string} [ifsc] IFSC.
     * @param {string} [clabe] Clabe.
     * @param {string} [bankName] Bank name.
     * @param {string} [bankUuid] Bank ID.
     * @param {string} [swiftCode] Swift code.
     * @param {string} [countryIso] ISO country code of the offer owner.
     * @param {string} [holderName] Holder name.
     * @param {boolean} [isPersonal] Is personal or business account.
     * @param {string} [accountNumber] Bank account number.
     * @param {string} [routingNumber] Routing number.
     * @param {string} [additionalInfo] Additional information about bank account with country-specific data.
     * @param {string} [fiatCurrencyCode] 3 letter ISO code for fiat currency.
     * @param {Array<InternationalDetailsObject>} [internationalDetails] International details.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    bankAccountCreate(iban?: string, ifsc?: string, clabe?: string, bankName?: string, bankUuid?: string, swiftCode?: string, countryIso?: string, holderName?: string, isPersonal?: boolean, accountNumber?: string, routingNumber?: string, additionalInfo?: string, fiatCurrencyCode?: string, internationalDetails?: Array<InternationalDetailsObject>, options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/bank-account/create`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (iban !== undefined) {
            localVarFormParams.set('iban', iban as any);
        }

        if (ifsc !== undefined) {
            localVarFormParams.set('ifsc', ifsc as any);
        }

        if (clabe !== undefined) {
            localVarFormParams.set('clabe', clabe as any);
        }

        if (bankName !== undefined) {
            localVarFormParams.set('bank_name', bankName as any);
        }

        if (bankUuid !== undefined) {
            localVarFormParams.set('bank_uuid', bankUuid as any);
        }

        if (swiftCode !== undefined) {
            localVarFormParams.set('swift_code', swiftCode as any);
        }

        if (countryIso !== undefined) {
            localVarFormParams.set('country_iso', countryIso as any);
        }

        if (holderName !== undefined) {
            localVarFormParams.set('holder_name', holderName as any);
        }

        if (isPersonal !== undefined) {
            localVarFormParams.set('is_personal', isPersonal as any);
        }

        if (accountNumber !== undefined) {
            localVarFormParams.set('account_number', accountNumber as any);
        }

        if (routingNumber !== undefined) {
            localVarFormParams.set('routing_number', routingNumber as any);
        }

        if (additionalInfo !== undefined) {
            localVarFormParams.set('additional_info', additionalInfo as any);
        }

        if (fiatCurrencyCode !== undefined) {
            localVarFormParams.set('fiat_currency_code', fiatCurrencyCode as any);
        }

        if (internationalDetails) {
            internationalDetails.forEach((element) => {
                localVarFormParams.append('international_details', element as any);
            })
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Delete bank account.
     * @summary bank-account/delete
     * @param {string} [bankAccountUuid] Bank account uuid.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    bankAccountDelete(bankAccountUuid?: string, options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/bank-account/delete`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (bankAccountUuid !== undefined) {
            localVarFormParams.set('bank_account_uuid', bankAccountUuid as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Show bank account.
     * @summary bank-account/get
     * @param {string} [bankAccountUuid] Bank account uuid.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    bankAccountGet(bankAccountUuid?: string, options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/bank-account/get`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (bankAccountUuid !== undefined) {
            localVarFormParams.set('bank_account_uuid', bankAccountUuid as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Fetch all available bank accounts.
     * @summary bank-account/list
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    bankAccountList(options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/bank-account/list`;
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
     * Update bank account.
     * @summary bank-account/update
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    bankAccountUpdate(options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/bank-account/update`;
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
};

export type BankAccountApiBankAccountCreateParams = {
    /**
     * IBAN.
     */
    iban?: string;

    /**
     * IFSC.
     */
    ifsc?: string;

    /**
     * Clabe.
     */
    clabe?: string;

    /**
     * Bank name.
     */
    bankName?: string;

    /**
     * Bank ID.
     */
    bankUuid?: string;

    /**
     * Swift code.
     */
    swiftCode?: string;

    /**
     * ISO country code of the offer owner.
     */
    countryIso?: string;

    /**
     * Holder name.
     */
    holderName?: string;

    /**
     * Is personal or business account.
     */
    isPersonal?: boolean;

    /**
     * Bank account number.
     */
    accountNumber?: string;

    /**
     * Routing number.
     */
    routingNumber?: string;

    /**
     * Additional information about bank account with country-specific data.
     */
    additionalInfo?: string;

    /**
     * 3 letter ISO code for fiat currency.
     */
    fiatCurrencyCode?: string;

    /**
     * International details.
     */
    internationalDetails?: Array<InternationalDetailsObject>;

}

export type BankAccountApiBankAccountDeleteParams = {
    /**
     * Bank account uuid.
     */
    bankAccountUuid?: string;

}

export type BankAccountApiBankAccountGetParams = {
    /**
     * Bank account uuid.
     */
    bankAccountUuid?: string;

}

export type BankAccountApiBankAccountListParams = {
}

export type BankAccountApiBankAccountUpdateParams = {
}


/**
 * BankAccountApi
 * @export
 * @class BankAccountApi
 * @extends {BaseAPI}
 */
export class BankAccountApi extends BaseAPI {
    /**
     * Create bank account.
     * @summary bank-account/create
     * @param { BankAccountApiBankAccountCreateParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BankAccountApi
     */
    public create(params?: BankAccountApiBankAccountCreateParams, options?: any): Promise<InlineResponse20034> {
        const localVarFetchArgs = BankAccountApiFetchParamCreator.bankAccountCreate(params?.iban, params?.ifsc, params?.clabe, params?.bankName, params?.bankUuid, params?.swiftCode, params?.countryIso, params?.holderName, params?.isPersonal, params?.accountNumber, params?.routingNumber, params?.additionalInfo, params?.fiatCurrencyCode, params?.internationalDetails, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Delete bank account.
     * @summary bank-account/delete
     * @param { BankAccountApiBankAccountDeleteParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BankAccountApi
     */
    public delete(params?: BankAccountApiBankAccountDeleteParams, options?: any): Promise<ModelObject> {
        const localVarFetchArgs = BankAccountApiFetchParamCreator.bankAccountDelete(params?.bankAccountUuid, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Show bank account.
     * @summary bank-account/get
     * @param { BankAccountApiBankAccountGetParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BankAccountApi
     */
    public get(params?: BankAccountApiBankAccountGetParams, options?: any): Promise<InlineResponse20025> {
        const localVarFetchArgs = BankAccountApiFetchParamCreator.bankAccountGet(params?.bankAccountUuid, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Fetch all available bank accounts.
     * @summary bank-account/list
     * @param { BankAccountApiBankAccountListParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BankAccountApi
     */
    public list(options?: any): Promise<InlineResponse20027> {
        const localVarFetchArgs = BankAccountApiFetchParamCreator.bankAccountList(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Update bank account.
     * @summary bank-account/update
     * @param { BankAccountApiBankAccountUpdateParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BankAccountApi
     */
    public update(options?: any): Promise<InlineResponse20034> {
        const localVarFetchArgs = BankAccountApiFetchParamCreator.bankAccountUpdate(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

}
/**
 * CurrencyApi - fetch parameter creator
 * @export
 */
export const CurrencyApiFetchParamCreator = {
    /**
     * Fetch allowed cryptocurrency list. Authentication is optional.
     * @summary crypto/list
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    cryptoList(options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/crypto/list`;
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
     * Return bitcoin price in US Dollars. The given price is used as indicative price of bitcoin on      the marketplace. Bitcoin price is being updated every 3 minutes. Authentication is optional.
     * @summary currency/btc
     * @param {string} [response] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    currencyBtc(response?: string, options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/currency/btc`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        if (response !== undefined) {
            localVarQueryParameter['response'] = response;
        }

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
     * Fetch all marketplace supported fiat currencies and their corresponding rates in crypto and USD.      Authentication is optional.
     * @summary currency/list
     * @param {string} [locale] Locale code, e.g. ru, pt_BR.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    currencyList(locale?: string, options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/currency/list`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (locale !== undefined) {
            localVarFormParams.set('locale', locale as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Fetch all marketplace supported fiat currencies and their corresponding rates in crypto and USD.     Authentication is required.
     * @summary currency/list-auth
     * @param {string} [locale] Locale code, e.g. ru, pt_BR.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    currencyListAuth(locale?: string, options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/currency/list-auth`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (locale !== undefined) {
            localVarFormParams.set('locale', locale as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Fetch all marketplace supported fiat currencies and their rates in USD and BTC.      Authentication is optional. Deprecated, use currency/list instead.
     * @summary currency/rates
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    currencyRates(options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/currency/rates`;
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
};

export type CurrencyApiCryptoListParams = {
}

export type CurrencyApiCurrencyBtcParams = {
    /**
     * 
     */
    response?: string;

}

export type CurrencyApiCurrencyListParams = {
    /**
     * Locale code, e.g. ru, pt_BR.
     */
    locale?: string;

}

export type CurrencyApiCurrencyListAuthParams = {
    /**
     * Locale code, e.g. ru, pt_BR.
     */
    locale?: string;

}

export type CurrencyApiCurrencyRatesParams = {
}


/**
 * CurrencyApi
 * @export
 * @class CurrencyApi
 * @extends {BaseAPI}
 */
export class CurrencyApi extends BaseAPI {
    /**
     * Fetch allowed cryptocurrency list. Authentication is optional.
     * @summary crypto/list
     * @param { CurrencyApiCryptoListParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof CurrencyApi
     */
    public cryptoList(options?: any): Promise<InlineResponse2009> {
        const localVarFetchArgs = CurrencyApiFetchParamCreator.cryptoList(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Return bitcoin price in US Dollars. The given price is used as indicative price of bitcoin on      the marketplace. Bitcoin price is being updated every 3 minutes. Authentication is optional.
     * @summary currency/btc
     * @param { CurrencyApiCurrencyBtcParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof CurrencyApi
     */
    public btc(params?: CurrencyApiCurrencyBtcParams, options?: any): Promise<CurrencyBtcResponse> {
        const localVarFetchArgs = CurrencyApiFetchParamCreator.currencyBtc(params?.response, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Fetch all marketplace supported fiat currencies and their corresponding rates in crypto and USD.      Authentication is optional.
     * @summary currency/list
     * @param { CurrencyApiCurrencyListParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof CurrencyApi
     */
    public list(params?: CurrencyApiCurrencyListParams, options?: any): Promise<InlineResponse20014> {
        const localVarFetchArgs = CurrencyApiFetchParamCreator.currencyList(params?.locale, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Fetch all marketplace supported fiat currencies and their corresponding rates in crypto and USD.     Authentication is required.
     * @summary currency/list-auth
     * @param { CurrencyApiCurrencyListAuthParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof CurrencyApi
     */
    public listAuth(params?: CurrencyApiCurrencyListAuthParams, options?: any): Promise<InlineResponse20014> {
        const localVarFetchArgs = CurrencyApiFetchParamCreator.currencyListAuth(params?.locale, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Fetch all marketplace supported fiat currencies and their rates in USD and BTC.      Authentication is optional. Deprecated, use currency/list instead.
     * @summary currency/rates
     * @param { CurrencyApiCurrencyRatesParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof CurrencyApi
     */
    public rates(options?: any): Promise<CurrencyRatesResponse> {
        const localVarFetchArgs = CurrencyApiFetchParamCreator.currencyRates(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

}
/**
 * FeedbackApi - fetch parameter creator
 * @export
 */
export const FeedbackApiFetchParamCreator = {
    /**
     * Give a feedback for a trade.             NB! Message should be encoded as required per RFC 3986 (i.e. spaces should look like %20).
     * @summary feedback/give
     * @param {number} rating Rating. Possible values: 1(positive), -1(negative).
     * @param {string} message Feedback message.
     * @param {string} tradeHash A hash (ID) of the trade.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    feedbackGive(rating: number, message: string, tradeHash: string, options: any = {}): FetchArgs {
        // verify required parameter 'rating' is not null or undefined
        if (rating === null || rating === undefined) {
            throw new RequiredError('rating','Required parameter rating was null or undefined when calling feedbackGive.');
        }
        // verify required parameter 'message' is not null or undefined
        if (message === null || message === undefined) {
            throw new RequiredError('message','Required parameter message was null or undefined when calling feedbackGive.');
        }
        // verify required parameter 'tradeHash' is not null or undefined
        if (tradeHash === null || tradeHash === undefined) {
            throw new RequiredError('tradeHash','Required parameter tradeHash was null or undefined when calling feedbackGive.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/feedback/give`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (rating !== undefined) {
            localVarFormParams.set('rating', rating as any);
        }

        if (message !== undefined) {
            localVarFormParams.set('message', message as any);
        }

        if (tradeHash !== undefined) {
            localVarFormParams.set('trade_hash', tradeHash as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Fetch all feedback either for a user or an offer. Latest feedback is returned first.
     * @summary feedback/list
     * @param {number} [page] A page to return, 10 feedback per page.
     * @param {string} [role] What kind of feedack to fetch - either from &#x27;buyers&#x27; or &#x27;sellers&#x27;. Possible values: &#x27;buyer&#x27;, &#x27;seller&#x27;.
     * @param {number} [rating] Rating. Possible values: 1(positive), -1(negative).
     * @param {string} [username] Username of a trader who you want to fetch feedback for.
Either this filter or &#x27;offer_hash&#x27; has to be used, if both are provided then an error will be returned.
     * @param {string} [offerHash] A hash (ID) of an offer.
Either this filter or &#x27;username&#x27; has to be used, if both are provided then an error will be returned.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    feedbackList(page?: number, role?: string, rating?: number, username?: string, offerHash?: string, options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/feedback/list`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (page !== undefined) {
            localVarFormParams.set('page', page as any);
        }

        if (role !== undefined) {
            localVarFormParams.set('role', role as any);
        }

        if (rating !== undefined) {
            localVarFormParams.set('rating', rating as any);
        }

        if (username !== undefined) {
            localVarFormParams.set('username', username as any);
        }

        if (offerHash !== undefined) {
            localVarFormParams.set('offer_hash', offerHash as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Reply to feedback.
     * @summary feedback/reply
     * @param {string} message Reply message.
     * @param {string} tradeHash A hash (ID) of the trade.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    feedbackReply(message: string, tradeHash: string, options: any = {}): FetchArgs {
        // verify required parameter 'message' is not null or undefined
        if (message === null || message === undefined) {
            throw new RequiredError('message','Required parameter message was null or undefined when calling feedbackReply.');
        }
        // verify required parameter 'tradeHash' is not null or undefined
        if (tradeHash === null || tradeHash === undefined) {
            throw new RequiredError('tradeHash','Required parameter tradeHash was null or undefined when calling feedbackReply.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/feedback/reply`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (message !== undefined) {
            localVarFormParams.set('message', message as any);
        }

        if (tradeHash !== undefined) {
            localVarFormParams.set('trade_hash', tradeHash as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
};

export type FeedbackApiFeedbackGiveParams = {
    /**
     * Rating. Possible values: 1(positive), -1(negative).
     */
    rating: number;

    /**
     * Feedback message.
     */
    message: string;

    /**
     * A hash (ID) of the trade.
     */
    tradeHash: string;

}

export type FeedbackApiFeedbackListParams = {
    /**
     * A page to return, 10 feedback per page.
     */
    page?: number;

    /**
     * What kind of feedack to fetch - either from &#x27;buyers&#x27; or &#x27;sellers&#x27;. Possible values: &#x27;buyer&#x27;, &#x27;seller&#x27;.
     */
    role?: string;

    /**
     * Rating. Possible values: 1(positive), -1(negative).
     */
    rating?: number;

    /**
     * Username of a trader who you want to fetch feedback for.
Either this filter or &#x27;offer_hash&#x27; has to be used, if both are provided then an error will be returned.
     */
    username?: string;

    /**
     * A hash (ID) of an offer.
Either this filter or &#x27;username&#x27; has to be used, if both are provided then an error will be returned.
     */
    offerHash?: string;

}

export type FeedbackApiFeedbackReplyParams = {
    /**
     * Reply message.
     */
    message: string;

    /**
     * A hash (ID) of the trade.
     */
    tradeHash: string;

}


/**
 * FeedbackApi
 * @export
 * @class FeedbackApi
 * @extends {BaseAPI}
 */
export class FeedbackApi extends BaseAPI {
    /**
     * Give a feedback for a trade.             NB! Message should be encoded as required per RFC 3986 (i.e. spaces should look like %20).
     * @summary feedback/give
     * @param { FeedbackApiFeedbackGiveParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FeedbackApi
     */
    public give(params: FeedbackApiFeedbackGiveParams, options?: any): Promise<SuccessTrueResponse> {
        const localVarFetchArgs = FeedbackApiFetchParamCreator.feedbackGive(params?.rating, params?.message, params?.tradeHash, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Fetch all feedback either for a user or an offer. Latest feedback is returned first.
     * @summary feedback/list
     * @param { FeedbackApiFeedbackListParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FeedbackApi
     */
    public list(params?: FeedbackApiFeedbackListParams, options?: any): Promise<InlineResponse20015> {
        const localVarFetchArgs = FeedbackApiFetchParamCreator.feedbackList(params?.page, params?.role, params?.rating, params?.username, params?.offerHash, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Reply to feedback.
     * @summary feedback/reply
     * @param { FeedbackApiFeedbackReplyParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FeedbackApi
     */
    public reply(params: FeedbackApiFeedbackReplyParams, options?: any): Promise<SuccessResponse> {
        const localVarFetchArgs = FeedbackApiFetchParamCreator.feedbackReply(params?.message, params?.tradeHash, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

}
/**
 * KioskApi - fetch parameter creator
 * @export
 */
export const KioskApiFetchParamCreator = {
    /**
     * Fetch a list of your Kiosk affiliate transactions. Two types of transactions returned:     commissions you have earned when people trade through your Kiosk,     transfers between affiliate wallet and main wallet.
     * @summary kiosk/transactions
     * @param {number} [page] Requested page, by default is 1
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    kioskTransactions(page?: number, options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/kiosk/transactions`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (page !== undefined) {
            localVarFormParams.set('page', page as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
};

export type KioskApiKioskTransactionsParams = {
    /**
     * Requested page, by default is 1
     */
    page?: number;

}


/**
 * KioskApi
 * @export
 * @class KioskApi
 * @extends {BaseAPI}
 */
export class KioskApi extends BaseAPI {
    /**
     * Fetch a list of your Kiosk affiliate transactions. Two types of transactions returned:     commissions you have earned when people trade through your Kiosk,     transfers between affiliate wallet and main wallet.
     * @summary kiosk/transactions
     * @param { KioskApiKioskTransactionsParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof KioskApi
     */
    public transactions(params?: KioskApiKioskTransactionsParams, options?: any): Promise<InlineResponse20030> {
        const localVarFetchArgs = KioskApiFetchParamCreator.kioskTransactions(params?.page, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

}
/**
 * NotificationsApi - fetch parameter creator
 * @export
 */
export const NotificationsApiFetchParamCreator = {
    /**
     * Fetch user's notifications, ordered by creation date (latest at the top).
     * @summary notifications/list
     * @param {number} [page] Requested page, by default is 1. Every page returns up to 50 notifications.
     * @param {boolean} [isRead] If FALSE then only unread notifications will be returned. If filter is not specified, then both read and unread ones will be returned.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    notificationsList(page?: number, isRead?: boolean, options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/notifications/list`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (page !== undefined) {
            localVarFormParams.set('page', page as any);
        }

        if (isRead !== undefined) {
            localVarFormParams.set('is_read', isRead as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Mark all unread notifications as read.
     * @summary notifications/mark-read
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    notificationsMarkRead(options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/notifications/mark-read`;
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
     * Fetch the number of unread notifications.
     * @summary notifications/unread-count
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    notificationsUnreadCount(options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/notifications/unread-count`;
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
};

export type NotificationsApiNotificationsListParams = {
    /**
     * Requested page, by default is 1. Every page returns up to 50 notifications.
     */
    page?: number;

    /**
     * If FALSE then only unread notifications will be returned. If filter is not specified, then both read and unread ones will be returned.
     */
    isRead?: boolean;

}

export type NotificationsApiNotificationsMarkReadParams = {
}

export type NotificationsApiNotificationsUnreadCountParams = {
}


/**
 * NotificationsApi
 * @export
 * @class NotificationsApi
 * @extends {BaseAPI}
 */
export class NotificationsApi extends BaseAPI {
    /**
     * Fetch user's notifications, ordered by creation date (latest at the top).
     * @summary notifications/list
     * @param { NotificationsApiNotificationsListParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsApi
     */
    public list(params?: NotificationsApiNotificationsListParams, options?: any): Promise<InlineResponse20031> {
        const localVarFetchArgs = NotificationsApiFetchParamCreator.notificationsList(params?.page, params?.isRead, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Mark all unread notifications as read.
     * @summary notifications/mark-read
     * @param { NotificationsApiNotificationsMarkReadParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsApi
     */
    public markRead(options?: any): Promise<SuccessResponse> {
        const localVarFetchArgs = NotificationsApiFetchParamCreator.notificationsMarkRead(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Fetch the number of unread notifications.
     * @summary notifications/unread-count
     * @param { NotificationsApiNotificationsUnreadCountParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsApi
     */
    public unreadCount(options?: any): Promise<InlineResponse20038> {
        const localVarFetchArgs = NotificationsApiFetchParamCreator.notificationsUnreadCount(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

}
/**
 * OfferApi - fetch parameter creator
 * @export
 */
export const OfferApiFetchParamCreator = {
    /**
     * Activate an offer.
     * @summary offer/activate
     * @param {string} offerHash A hash (ID) of the offer.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    offerActivate(offerHash: string, options: any = {}): FetchArgs {
        // verify required parameter 'offerHash' is not null or undefined
        if (offerHash === null || offerHash === undefined) {
            throw new RequiredError('offerHash','Required parameter offerHash was null or undefined when calling offerActivate.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/offer/activate`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (offerHash !== undefined) {
            localVarFormParams.set('offer_hash', offerHash as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Fetch offers. Authentication is optional         (replaces deprecated method of /buy-bitcoin?format=json, results are cached for 1 minute).
     * @summary offer/all
     * @param {string} type Will return offers of given type without applying a domain logic that &#x27;offer_type&#x27; filter has. If you specify &#x27;sell&#x27; then offers with this type will be returned and so on. See also offer_type filter. Either &#x27;offer_type&#x27; or &#x27;type&#x27; filter needs to be provided. If &#x27;offer_type&#x27; filter is provided then this filter will be ignored. Possible values: &#x27;buy&#x27;, &#x27;sell&#x27;.
     * @param {string} group A group of payment methods(slug). For a list of available payment method groups please refer to payment-method-group/list endpoint.
     * @param {number} limit How many offers to return.
     * @param {number} offset An offset for a result.
     * @param {number} fiatMin Will return offers where this value either fits into trade limits or equals to a predefined amount.
     * @param {number} geonameId Deprecated field. Please use location_id.
     * @param {number} marginMax Search offers with margin less than the value. Ignored when offer is of fixed price.
     * @param {number} marginMin Search offers with margin greater than the value. Ignored when offer is of fixed price.
     * @param {string} offerType If you would like to get offers that you can use &lt;b&gt;to buy crypto&lt;/b&gt;, then in fact you need to see offers &lt;b&gt;where other vendors are selling crypto&lt;/b&gt;, hence you need to specify &#x27;buy&#x27; to get &#x27;sell&#x27; offers and vice versa. If you just would like to get offers filtered by type they have, then you can use &#x27;type&#x27; parameter instead. Either &#x27;offer_type&#x27; or &#x27;type&#x27; filter needs to be provided. If this filter is provided then &#x27;type&#x27; will be ignored.
     * @param {string} userTypes Comma separated list of user types whose offers to return - i.e. power_trader, expert_trader. For a list of all available user types please refer to user/types endpoint. You can also provide “all” value, in this case offers of users of either available type will be returned.
     * @param {number} locationId Location id is needed to search
for offers with specific payment methods, e.g. Cash in Person, Gold. If payment method is another - parameter will be ignored.
You can find location ids here: https://www.geonames.org/.
For better experience use locations ids of countries and cities.
     * @param {string} userCountry ISO country code, e.g. &#x27;US&#x27;. Filter offers by available payment methods in the given country. Please use &#x27;WORLDWIDE&#x27; if you want to get offers from all countries.
For authenticated user by default automatically detected country will be used. For non-authenticated user &#x27;US&#x27; will be used. This filter corresponds to &#x27;Offer location&#x27; filter available on marketplace.
     * @param {string} currencyCode 3 letter ISO code for fiat currency. &#x27;USD&#x27; or any other. Case insensitive.
     * @param {string} paymentMethod A slug of the payment method. To see a list of payment method slugs please refer to payment-method/list endpoint.
     * @param {number} fiatAmountMax Search offers with trade limit less than the value.
     * @param {number} fiatAmountMin Search offers with trade limit greater than the value.
     * @param {string} cryptoCurrencyCode A filter by crypto currency code, default is &#x27;btc&#x27;. For a list of current supported cryptocurrencies please refer to crypto/list endpoint.
     * @param {number} fiatFixedPriceMax Search offers with fiat price per crypto less than the value.
     * @param {number} fiatFixedPriceMin Search offers with fiat price per crypto greater than the value.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    offerAll(type: string, group: string, limit: number, offset: number, fiatMin: number, geonameId: number, marginMax: number, marginMin: number, offerType: string, userTypes: string, locationId: number, userCountry: string, currencyCode: string, paymentMethod: string, fiatAmountMax: number, fiatAmountMin: number, cryptoCurrencyCode: string, fiatFixedPriceMax: number, fiatFixedPriceMin: number, options: any = {}): FetchArgs {
        // verify required parameter 'type' is not null or undefined
        if (type === null || type === undefined) {
            throw new RequiredError('type','Required parameter type was null or undefined when calling offerAll.');
        }
        // verify required parameter 'group' is not null or undefined
        if (group === null || group === undefined) {
            throw new RequiredError('group','Required parameter group was null or undefined when calling offerAll.');
        }
        // verify required parameter 'limit' is not null or undefined
        if (limit === null || limit === undefined) {
            throw new RequiredError('limit','Required parameter limit was null or undefined when calling offerAll.');
        }
        // verify required parameter 'offset' is not null or undefined
        if (offset === null || offset === undefined) {
            throw new RequiredError('offset','Required parameter offset was null or undefined when calling offerAll.');
        }
        // verify required parameter 'fiatMin' is not null or undefined
        if (fiatMin === null || fiatMin === undefined) {
            throw new RequiredError('fiatMin','Required parameter fiatMin was null or undefined when calling offerAll.');
        }
        // verify required parameter 'geonameId' is not null or undefined
        if (geonameId === null || geonameId === undefined) {
            throw new RequiredError('geonameId','Required parameter geonameId was null or undefined when calling offerAll.');
        }
        // verify required parameter 'marginMax' is not null or undefined
        if (marginMax === null || marginMax === undefined) {
            throw new RequiredError('marginMax','Required parameter marginMax was null or undefined when calling offerAll.');
        }
        // verify required parameter 'marginMin' is not null or undefined
        if (marginMin === null || marginMin === undefined) {
            throw new RequiredError('marginMin','Required parameter marginMin was null or undefined when calling offerAll.');
        }
        // verify required parameter 'offerType' is not null or undefined
        if (offerType === null || offerType === undefined) {
            throw new RequiredError('offerType','Required parameter offerType was null or undefined when calling offerAll.');
        }
        // verify required parameter 'userTypes' is not null or undefined
        if (userTypes === null || userTypes === undefined) {
            throw new RequiredError('userTypes','Required parameter userTypes was null or undefined when calling offerAll.');
        }
        // verify required parameter 'locationId' is not null or undefined
        if (locationId === null || locationId === undefined) {
            throw new RequiredError('locationId','Required parameter locationId was null or undefined when calling offerAll.');
        }
        // verify required parameter 'userCountry' is not null or undefined
        if (userCountry === null || userCountry === undefined) {
            throw new RequiredError('userCountry','Required parameter userCountry was null or undefined when calling offerAll.');
        }
        // verify required parameter 'currencyCode' is not null or undefined
        if (currencyCode === null || currencyCode === undefined) {
            throw new RequiredError('currencyCode','Required parameter currencyCode was null or undefined when calling offerAll.');
        }
        // verify required parameter 'paymentMethod' is not null or undefined
        if (paymentMethod === null || paymentMethod === undefined) {
            throw new RequiredError('paymentMethod','Required parameter paymentMethod was null or undefined when calling offerAll.');
        }
        // verify required parameter 'fiatAmountMax' is not null or undefined
        if (fiatAmountMax === null || fiatAmountMax === undefined) {
            throw new RequiredError('fiatAmountMax','Required parameter fiatAmountMax was null or undefined when calling offerAll.');
        }
        // verify required parameter 'fiatAmountMin' is not null or undefined
        if (fiatAmountMin === null || fiatAmountMin === undefined) {
            throw new RequiredError('fiatAmountMin','Required parameter fiatAmountMin was null or undefined when calling offerAll.');
        }
        // verify required parameter 'cryptoCurrencyCode' is not null or undefined
        if (cryptoCurrencyCode === null || cryptoCurrencyCode === undefined) {
            throw new RequiredError('cryptoCurrencyCode','Required parameter cryptoCurrencyCode was null or undefined when calling offerAll.');
        }
        // verify required parameter 'fiatFixedPriceMax' is not null or undefined
        if (fiatFixedPriceMax === null || fiatFixedPriceMax === undefined) {
            throw new RequiredError('fiatFixedPriceMax','Required parameter fiatFixedPriceMax was null or undefined when calling offerAll.');
        }
        // verify required parameter 'fiatFixedPriceMin' is not null or undefined
        if (fiatFixedPriceMin === null || fiatFixedPriceMin === undefined) {
            throw new RequiredError('fiatFixedPriceMin','Required parameter fiatFixedPriceMin was null or undefined when calling offerAll.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/offer/all`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (type !== undefined) {
            localVarFormParams.set('type', type as any);
        }

        if (group !== undefined) {
            localVarFormParams.set('group', group as any);
        }

        if (limit !== undefined) {
            localVarFormParams.set('limit', limit as any);
        }

        if (offset !== undefined) {
            localVarFormParams.set('offset', offset as any);
        }

        if (fiatMin !== undefined) {
            localVarFormParams.set('fiat_min', fiatMin as any);
        }

        if (geonameId !== undefined) {
            localVarFormParams.set('geoname_id', geonameId as any);
        }

        if (marginMax !== undefined) {
            localVarFormParams.set('margin_max', marginMax as any);
        }

        if (marginMin !== undefined) {
            localVarFormParams.set('margin_min', marginMin as any);
        }

        if (offerType !== undefined) {
            localVarFormParams.set('offer_type', offerType as any);
        }

        if (userTypes !== undefined) {
            localVarFormParams.set('user_types', userTypes as any);
        }

        if (locationId !== undefined) {
            localVarFormParams.set('location_id', locationId as any);
        }

        if (userCountry !== undefined) {
            localVarFormParams.set('user_country', userCountry as any);
        }

        if (currencyCode !== undefined) {
            localVarFormParams.set('currency_code', currencyCode as any);
        }

        if (paymentMethod !== undefined) {
            localVarFormParams.set('payment_method', paymentMethod as any);
        }

        if (fiatAmountMax !== undefined) {
            localVarFormParams.set('fiat_amount_max', fiatAmountMax as any);
        }

        if (fiatAmountMin !== undefined) {
            localVarFormParams.set('fiat_amount_min', fiatAmountMin as any);
        }

        if (cryptoCurrencyCode !== undefined) {
            localVarFormParams.set('crypto_currency_code', cryptoCurrencyCode as any);
        }

        if (fiatFixedPriceMax !== undefined) {
            localVarFormParams.set('fiat_fixed_price_max', fiatFixedPriceMax as any);
        }

        if (fiatFixedPriceMin !== undefined) {
            localVarFormParams.set('fiat_fixed_price_min', fiatFixedPriceMin as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Create an offer.
     * @summary offer/create
     * @param {string} tags Comma-separated list of tags. For a list of available tags please refer to offer-tag/list and use &#x27;slug&#x27; parameter.
     * @param {number} margin A percent that determines differences between market price and the price of the offer.
     * @param {string} currency 3 letter ISO code for fiat currency. &#x27;USD&#x27; or any other. Case insensitive.
     * @param {string} flowType A flow type for offer.
     * @param {number} rangeMax A maximum value of the trade limit, i.e the largest amount of fiat that a trade can be started with. (Minimum value for the field 1).
     * @param {number} rangeMin A minimum value of the trade limit, i.e the smallest amount of fiat that a trade can be started with. (Minimum value for the field 1).
     * @param {number} fixedPrice Should be used only if the offer is created as a fixed price offer. If this parameter is used then &#x27;margin&#x27; should not be specified.
     * @param {number} locationId Location id is needed to search for offers with specific payment methods,
e.g. Cash in Person, Gold. If payment method is another - parameter will be ignored.
You can find location ids here: https://www.geonames.org/.
For better experience use locations ids of countries and cities.
     * @param {string} offerTerms Terms of the offer for a trade partner. String up to 2500 characters.
     * @param {string} bankAccounts Comma-separated list of bank account UUIDs.
     * @param {string} tradeDetails Instructions for a trade partner. String up to 2500 characters.
     * @param {boolean} isFixedPrice Fixes the price of your cryptocurrency, rather than using the market price. If this field is used, then you should also specify a value for &#x27;fixed_price&#x27;.
     * @param {string} paymentMethod A slug of the payment method. To see a list of payment method slugs please refer to payment-method/list endpoint.
     * @param {number} paymentWindow How much time the trade partner has to make the payment and click &#x27;Paid&#x27; before the trade is automatically canceled. Integer between 30 to 43200.
     * @param {string} cryptoCurrency A cryptocurrency that this offer will use, a code should be specified. For example - btc, eth. If not set, then &#x27;btc&#x27; will be used as a default.
     * @param {string} paymentCountry 3 letter ISO country code (e.g. USA, EST, fra, etc.). If the payment method is country-specific, specify the most relevant country associated with this payment method.
     * @param {string} offerTypeField An offer type. Possible values: &#x27;buy&#x27;, &#x27;sell&#x27;.
     * @param {string} predefinedAmount Comma-separated predefined amounts of fiat currency, i.e. 20,30,50. If not specified, then a user can enter any amount within the offer range.
     * @param {string} paymentMethodGroup A group of payment methods. For a list of available payment method groups please refer to payment-method-group/list endpoint.
     * @param {string} paymentMethodLabel A bank name will appear after the payment method. Maximum 25 characters and only letters, numbers, and dash. You can write several bank names separated by space. For example: CBS SEB METROPOLITAN ALFA.
     * @param {OfferUpdateRequestBodyBankReferenceMessage} bankReferenceMessage 
     * @param {boolean} showOnlyTrustedUser The offer will be shown only to users from the trusted list.
     * @param {string} countryLimitationList Comma-separated list of &#x27;ISO Alpha-2&#x27; country codes.
     * @param {string} countryLimitationType Type of limitation countries. Valid values are &#x27;allowed&#x27; or &#x27;disallowed&#x27;. If &#x27;allowed&#x27; is used then the offer will be visible ONLY for visitors from countries specified in the &#x27;country_limitation_list&#x27;. If &#x27;disallowed&#x27; is used then this offer will NOT be visible for visitors from countries specified in the &#x27;country_limitation_list&#x27;.
     * @param {number} requireMinPastTrades The offer will be shown only to users with a given amount of past trades.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    offerCreate(tags: string, margin: number, currency: string, flowType: string, rangeMax: number, rangeMin: number, fixedPrice: number, locationId: number, offerTerms: string, bankAccounts: string, tradeDetails: string, isFixedPrice: boolean, paymentMethod: string, paymentWindow: number, cryptoCurrency: string, paymentCountry: string, offerTypeField: string, predefinedAmount: string, paymentMethodGroup: string, paymentMethodLabel: string, bankReferenceMessage: OfferUpdateRequestBodyBankReferenceMessage, showOnlyTrustedUser: boolean, countryLimitationList: string, countryLimitationType: string, requireMinPastTrades: number, options: any = {}): FetchArgs {
        // verify required parameter 'tags' is not null or undefined
        if (tags === null || tags === undefined) {
            throw new RequiredError('tags','Required parameter tags was null or undefined when calling offerCreate.');
        }
        // verify required parameter 'margin' is not null or undefined
        if (margin === null || margin === undefined) {
            throw new RequiredError('margin','Required parameter margin was null or undefined when calling offerCreate.');
        }
        // verify required parameter 'currency' is not null or undefined
        if (currency === null || currency === undefined) {
            throw new RequiredError('currency','Required parameter currency was null or undefined when calling offerCreate.');
        }
        // verify required parameter 'flowType' is not null or undefined
        if (flowType === null || flowType === undefined) {
            throw new RequiredError('flowType','Required parameter flowType was null or undefined when calling offerCreate.');
        }
        // verify required parameter 'rangeMax' is not null or undefined
        if (rangeMax === null || rangeMax === undefined) {
            throw new RequiredError('rangeMax','Required parameter rangeMax was null or undefined when calling offerCreate.');
        }
        // verify required parameter 'rangeMin' is not null or undefined
        if (rangeMin === null || rangeMin === undefined) {
            throw new RequiredError('rangeMin','Required parameter rangeMin was null or undefined when calling offerCreate.');
        }
        // verify required parameter 'fixedPrice' is not null or undefined
        if (fixedPrice === null || fixedPrice === undefined) {
            throw new RequiredError('fixedPrice','Required parameter fixedPrice was null or undefined when calling offerCreate.');
        }
        // verify required parameter 'locationId' is not null or undefined
        if (locationId === null || locationId === undefined) {
            throw new RequiredError('locationId','Required parameter locationId was null or undefined when calling offerCreate.');
        }
        // verify required parameter 'offerTerms' is not null or undefined
        if (offerTerms === null || offerTerms === undefined) {
            throw new RequiredError('offerTerms','Required parameter offerTerms was null or undefined when calling offerCreate.');
        }
        // verify required parameter 'bankAccounts' is not null or undefined
        if (bankAccounts === null || bankAccounts === undefined) {
            throw new RequiredError('bankAccounts','Required parameter bankAccounts was null or undefined when calling offerCreate.');
        }
        // verify required parameter 'tradeDetails' is not null or undefined
        if (tradeDetails === null || tradeDetails === undefined) {
            throw new RequiredError('tradeDetails','Required parameter tradeDetails was null or undefined when calling offerCreate.');
        }
        // verify required parameter 'isFixedPrice' is not null or undefined
        if (isFixedPrice === null || isFixedPrice === undefined) {
            throw new RequiredError('isFixedPrice','Required parameter isFixedPrice was null or undefined when calling offerCreate.');
        }
        // verify required parameter 'paymentMethod' is not null or undefined
        if (paymentMethod === null || paymentMethod === undefined) {
            throw new RequiredError('paymentMethod','Required parameter paymentMethod was null or undefined when calling offerCreate.');
        }
        // verify required parameter 'paymentWindow' is not null or undefined
        if (paymentWindow === null || paymentWindow === undefined) {
            throw new RequiredError('paymentWindow','Required parameter paymentWindow was null or undefined when calling offerCreate.');
        }
        // verify required parameter 'cryptoCurrency' is not null or undefined
        if (cryptoCurrency === null || cryptoCurrency === undefined) {
            throw new RequiredError('cryptoCurrency','Required parameter cryptoCurrency was null or undefined when calling offerCreate.');
        }
        // verify required parameter 'paymentCountry' is not null or undefined
        if (paymentCountry === null || paymentCountry === undefined) {
            throw new RequiredError('paymentCountry','Required parameter paymentCountry was null or undefined when calling offerCreate.');
        }
        // verify required parameter 'offerTypeField' is not null or undefined
        if (offerTypeField === null || offerTypeField === undefined) {
            throw new RequiredError('offerTypeField','Required parameter offerTypeField was null or undefined when calling offerCreate.');
        }
        // verify required parameter 'predefinedAmount' is not null or undefined
        if (predefinedAmount === null || predefinedAmount === undefined) {
            throw new RequiredError('predefinedAmount','Required parameter predefinedAmount was null or undefined when calling offerCreate.');
        }
        // verify required parameter 'paymentMethodGroup' is not null or undefined
        if (paymentMethodGroup === null || paymentMethodGroup === undefined) {
            throw new RequiredError('paymentMethodGroup','Required parameter paymentMethodGroup was null or undefined when calling offerCreate.');
        }
        // verify required parameter 'paymentMethodLabel' is not null or undefined
        if (paymentMethodLabel === null || paymentMethodLabel === undefined) {
            throw new RequiredError('paymentMethodLabel','Required parameter paymentMethodLabel was null or undefined when calling offerCreate.');
        }
        // verify required parameter 'bankReferenceMessage' is not null or undefined
        if (bankReferenceMessage === null || bankReferenceMessage === undefined) {
            throw new RequiredError('bankReferenceMessage','Required parameter bankReferenceMessage was null or undefined when calling offerCreate.');
        }
        // verify required parameter 'showOnlyTrustedUser' is not null or undefined
        if (showOnlyTrustedUser === null || showOnlyTrustedUser === undefined) {
            throw new RequiredError('showOnlyTrustedUser','Required parameter showOnlyTrustedUser was null or undefined when calling offerCreate.');
        }
        // verify required parameter 'countryLimitationList' is not null or undefined
        if (countryLimitationList === null || countryLimitationList === undefined) {
            throw new RequiredError('countryLimitationList','Required parameter countryLimitationList was null or undefined when calling offerCreate.');
        }
        // verify required parameter 'countryLimitationType' is not null or undefined
        if (countryLimitationType === null || countryLimitationType === undefined) {
            throw new RequiredError('countryLimitationType','Required parameter countryLimitationType was null or undefined when calling offerCreate.');
        }
        // verify required parameter 'requireMinPastTrades' is not null or undefined
        if (requireMinPastTrades === null || requireMinPastTrades === undefined) {
            throw new RequiredError('requireMinPastTrades','Required parameter requireMinPastTrades was null or undefined when calling offerCreate.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/offer/create`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (tags !== undefined) {
            localVarFormParams.set('tags', tags as any);
        }

        if (margin !== undefined) {
            localVarFormParams.set('margin', margin as any);
        }

        if (currency !== undefined) {
            localVarFormParams.set('currency', currency as any);
        }

        if (flowType !== undefined) {
            localVarFormParams.set('flow_type', flowType as any);
        }

        if (rangeMax !== undefined) {
            localVarFormParams.set('range_max', rangeMax as any);
        }

        if (rangeMin !== undefined) {
            localVarFormParams.set('range_min', rangeMin as any);
        }

        if (fixedPrice !== undefined) {
            localVarFormParams.set('fixed_price', fixedPrice as any);
        }

        if (locationId !== undefined) {
            localVarFormParams.set('location_id', locationId as any);
        }

        if (offerTerms !== undefined) {
            localVarFormParams.set('offer_terms', offerTerms as any);
        }

        if (bankAccounts !== undefined) {
            localVarFormParams.set('bank_accounts', bankAccounts as any);
        }

        if (tradeDetails !== undefined) {
            localVarFormParams.set('trade_details', tradeDetails as any);
        }

        if (isFixedPrice !== undefined) {
            localVarFormParams.set('is_fixed_price', isFixedPrice as any);
        }

        if (paymentMethod !== undefined) {
            localVarFormParams.set('payment_method', paymentMethod as any);
        }

        if (paymentWindow !== undefined) {
            localVarFormParams.set('payment_window', paymentWindow as any);
        }

        if (cryptoCurrency !== undefined) {
            localVarFormParams.set('crypto_currency', cryptoCurrency as any);
        }

        if (paymentCountry !== undefined) {
            localVarFormParams.set('payment_country', paymentCountry as any);
        }

        if (offerTypeField !== undefined) {
            localVarFormParams.set('offer_type_field', offerTypeField as any);
        }

        if (predefinedAmount !== undefined) {
            localVarFormParams.set('predefined_amount', predefinedAmount as any);
        }

        if (paymentMethodGroup !== undefined) {
            localVarFormParams.set('payment_method_group', paymentMethodGroup as any);
        }

        if (paymentMethodLabel !== undefined) {
            localVarFormParams.set('payment_method_label', paymentMethodLabel as any);
        }

        if (bankReferenceMessage !== undefined) {
            localVarFormParams.set('bank_reference_message', bankReferenceMessage as any);
        }

        if (showOnlyTrustedUser !== undefined) {
            localVarFormParams.set('show_only_trusted_user', showOnlyTrustedUser as any);
        }

        if (countryLimitationList !== undefined) {
            localVarFormParams.set('country_limitation_list', countryLimitationList as any);
        }

        if (countryLimitationType !== undefined) {
            localVarFormParams.set('country_limitation_type', countryLimitationType as any);
        }

        if (requireMinPastTrades !== undefined) {
            localVarFormParams.set('require_min_past_trades', requireMinPastTrades as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Deactivate an offer.
     * @summary offer/deactivate
     * @param {string} offerHash A hash (ID) of the offer.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    offerDeactivate(offerHash: string, options: any = {}): FetchArgs {
        // verify required parameter 'offerHash' is not null or undefined
        if (offerHash === null || offerHash === undefined) {
            throw new RequiredError('offerHash','Required parameter offerHash was null or undefined when calling offerDeactivate.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/offer/deactivate`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (offerHash !== undefined) {
            localVarFormParams.set('offer_hash', offerHash as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Delete an offer.
     * @summary offer/delete
     * @param {string} offerHash A hash (ID) of the offer.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    offerDelete(offerHash: string, options: any = {}): FetchArgs {
        // verify required parameter 'offerHash' is not null or undefined
        if (offerHash === null || offerHash === undefined) {
            throw new RequiredError('offerHash','Required parameter offerHash was null or undefined when calling offerDelete.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/offer/delete`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (offerHash !== undefined) {
            localVarFormParams.set('offer_hash', offerHash as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Fetch information for an offer.
     * @summary offer/get
     * @param {string} offerHash A hash (ID) of the offer.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    offerGet(offerHash: string, options: any = {}): FetchArgs {
        // verify required parameter 'offerHash' is not null or undefined
        if (offerHash === null || offerHash === undefined) {
            throw new RequiredError('offerHash','Required parameter offerHash was null or undefined when calling offerGet.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/offer/get`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (offerHash !== undefined) {
            localVarFormParams.set('offer_hash', offerHash as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Return all your offers.
     * @summary offer/list
     * @param {boolean} active A filter by active/not active offers, by default all offers are displayed.
     * @param {string} offerType An offer type. Possible values: &#x27;buy&#x27;, &#x27;sell&#x27;.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    offerList(active: boolean, offerType: string, options: any = {}): FetchArgs {
        // verify required parameter 'active' is not null or undefined
        if (active === null || active === undefined) {
            throw new RequiredError('active','Required parameter active was null or undefined when calling offerList.');
        }
        // verify required parameter 'offerType' is not null or undefined
        if (offerType === null || offerType === undefined) {
            throw new RequiredError('offerType','Required parameter offerType was null or undefined when calling offerList.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/offer/list`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (active !== undefined) {
            localVarFormParams.set('active', active as any);
        }

        if (offerType !== undefined) {
            localVarFormParams.set('offer_type', offerType as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Return a price for an offer         (if offer happens to be in fiat currency other than USD, then it will be recalculated to it).
     * @summary offer/price
     * @param {string} offerHash A hash (ID) of the offer.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    offerPrice(offerHash: string, options: any = {}): FetchArgs {
        // verify required parameter 'offerHash' is not null or undefined
        if (offerHash === null || offerHash === undefined) {
            throw new RequiredError('offerHash','Required parameter offerHash was null or undefined when calling offerPrice.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/offer/price`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (offerHash !== undefined) {
            localVarFormParams.set('offer_hash', offerHash as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Return all prices for offers for a given payment method.
     * @summary offer/prices
     * @param {string} paymentMethod A slug of the payment method. To see a list of payment method slugs please refer to payment-method/list endpoint.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    offerPrices(paymentMethod: string, options: any = {}): FetchArgs {
        // verify required parameter 'paymentMethod' is not null or undefined
        if (paymentMethod === null || paymentMethod === undefined) {
            throw new RequiredError('paymentMethod','Required parameter paymentMethod was null or undefined when calling offerPrices.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/offer/prices`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (paymentMethod !== undefined) {
            localVarFormParams.set('payment_method', paymentMethod as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Turn off all your offers.
     * @summary offer/turn-off
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    offerTurnOff(options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/offer/turn-off`;
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
     * Turn on all your offers.
     * @summary offer/turn-on
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    offerTurnOn(options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/offer/turn-on`;
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
     * Update an offer.
     * @summary offer/update
     * @param {string} tags Comma-separated list of tags. For a list of available tags please refer to offer-tag/list and use &#x27;slug&#x27; parameter.
     * @param {number} margin A percent that determines differences between market price and the price of the offer.
     * @param {string} currency 3 letter ISO code of fiat currency, e.g. USD. Case insensitive.
     * @param {string} flowType A flow type for offer.
     * @param {OfferUpdateRequestBodyOfferCap} offerCap 
     * @param {number} rangeMax A maximum value of the trade limit, i.e the largest amount of fiat that a trade can be started with. (Minimum value for the field 1).
     * @param {number} rangeMin A minimum value of the trade limit, i.e the smallest amount of fiat that a trade can be started with. (Minimum value for the field 1).
     * @param {Array<OfferDutyHours>} dutyHours An array of intervals when the offer is active for the week.
     * @param {string} offerHash A hash (ID) of the offer.
     * @param {number} fixedPrice Should be used only if the offer is created as a fixed price offer. If this parameter is used then &#x27;margin&#x27; should not be specified.
     * @param {number} locationId Location id is needed to search for offers with specific payment methods,
e.g. Cash in Person, Gold. If payment method is another - parameter will be ignored.
You can find location ids here: https://www.geonames.org/.
For better experience use locations ids of countries and cities.
     * @param {string} offerTerms Terms of the offer for a trade partner. String up to 2500 characters.
     * @param {string} bankAccounts Comma-separated list of bank account UUIDs.
     * @param {string} tradeDetails Instructions for a trade partner. String up to 2500 characters.
     * @param {string} paymentMethod A slug of the payment method. To see a list of payment method slugs please refer to payment-method/list endpoint.
     * @param {number} paymentWindow How much time the trade partner has to make the payment and click &#x27;Paid&#x27; before the trade is automatically canceled. Integer between 30 to 43200.
     * @param {string} paymentCountry 3 letter ISO country code (e.g. USA, EST, fra, etc.). If the payment method is country-specific, specify the most relevant country associated with this payment method.
     * @param {string} predefinedAmount Comma-separated predefined amounts of fiat currency, i.e. 20,30,50. If not specified, then a user can enter any amount within the offer range.
     * @param {string} paymentMethodGroup A group of payment methods. For a list of available payment method groups please refer to payment-method-group/list endpoint.
     * @param {string} paymentMethodLabel A bank name will appear after the payment method. Maximum 25 characters and only letters, numbers, and dash. You can write several bank names separated by space, e.g. CBS SEB METROPOLITAN ALFA.
     * @param {OfferUpdateRequestBodyBankReferenceMessage} bankReferenceMessage 
     * @param {boolean} showOnlyTrustedUser The offer will be shown only to users from the trusted list.
     * @param {string} countryLimitationList Comma-separated list of &#x27;ISO Alpha-2&#x27; country codes.
     * @param {string} countryLimitationType Type of limitation countries. Valid values are &#x27;allowed&#x27; or &#x27;disallowed&#x27;. If &#x27;allowed&#x27; is used then the offer will be visible ONLY for visitors from countries specified in the &#x27;country_limitation_list&#x27;. If &#x27;disallowed&#x27; is used then this offer will NOT be visible for visitors from countries specified in the &#x27;country_limitation_list&#x27;.
     * @param {boolean} requireMinPastTrades The offer will be shown only to users with a given amount of past trades.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    offerUpdate(tags: string, margin: number, currency: string, flowType: string, offerCap: OfferUpdateRequestBodyOfferCap, rangeMax: number, rangeMin: number, dutyHours: Array<OfferDutyHours>, offerHash: string, fixedPrice: number, locationId: number, offerTerms: string, bankAccounts: string, tradeDetails: string, paymentMethod: string, paymentWindow: number, paymentCountry: string, predefinedAmount: string, paymentMethodGroup: string, paymentMethodLabel: string, bankReferenceMessage: OfferUpdateRequestBodyBankReferenceMessage, showOnlyTrustedUser: boolean, countryLimitationList: string, countryLimitationType: string, requireMinPastTrades: boolean, options: any = {}): FetchArgs {
        // verify required parameter 'tags' is not null or undefined
        if (tags === null || tags === undefined) {
            throw new RequiredError('tags','Required parameter tags was null or undefined when calling offerUpdate.');
        }
        // verify required parameter 'margin' is not null or undefined
        if (margin === null || margin === undefined) {
            throw new RequiredError('margin','Required parameter margin was null or undefined when calling offerUpdate.');
        }
        // verify required parameter 'currency' is not null or undefined
        if (currency === null || currency === undefined) {
            throw new RequiredError('currency','Required parameter currency was null or undefined when calling offerUpdate.');
        }
        // verify required parameter 'flowType' is not null or undefined
        if (flowType === null || flowType === undefined) {
            throw new RequiredError('flowType','Required parameter flowType was null or undefined when calling offerUpdate.');
        }
        // verify required parameter 'offerCap' is not null or undefined
        if (offerCap === null || offerCap === undefined) {
            throw new RequiredError('offerCap','Required parameter offerCap was null or undefined when calling offerUpdate.');
        }
        // verify required parameter 'rangeMax' is not null or undefined
        if (rangeMax === null || rangeMax === undefined) {
            throw new RequiredError('rangeMax','Required parameter rangeMax was null or undefined when calling offerUpdate.');
        }
        // verify required parameter 'rangeMin' is not null or undefined
        if (rangeMin === null || rangeMin === undefined) {
            throw new RequiredError('rangeMin','Required parameter rangeMin was null or undefined when calling offerUpdate.');
        }
        // verify required parameter 'dutyHours' is not null or undefined
        if (dutyHours === null || dutyHours === undefined) {
            throw new RequiredError('dutyHours','Required parameter dutyHours was null or undefined when calling offerUpdate.');
        }
        // verify required parameter 'offerHash' is not null or undefined
        if (offerHash === null || offerHash === undefined) {
            throw new RequiredError('offerHash','Required parameter offerHash was null or undefined when calling offerUpdate.');
        }
        // verify required parameter 'fixedPrice' is not null or undefined
        if (fixedPrice === null || fixedPrice === undefined) {
            throw new RequiredError('fixedPrice','Required parameter fixedPrice was null or undefined when calling offerUpdate.');
        }
        // verify required parameter 'locationId' is not null or undefined
        if (locationId === null || locationId === undefined) {
            throw new RequiredError('locationId','Required parameter locationId was null or undefined when calling offerUpdate.');
        }
        // verify required parameter 'offerTerms' is not null or undefined
        if (offerTerms === null || offerTerms === undefined) {
            throw new RequiredError('offerTerms','Required parameter offerTerms was null or undefined when calling offerUpdate.');
        }
        // verify required parameter 'bankAccounts' is not null or undefined
        if (bankAccounts === null || bankAccounts === undefined) {
            throw new RequiredError('bankAccounts','Required parameter bankAccounts was null or undefined when calling offerUpdate.');
        }
        // verify required parameter 'tradeDetails' is not null or undefined
        if (tradeDetails === null || tradeDetails === undefined) {
            throw new RequiredError('tradeDetails','Required parameter tradeDetails was null or undefined when calling offerUpdate.');
        }
        // verify required parameter 'paymentMethod' is not null or undefined
        if (paymentMethod === null || paymentMethod === undefined) {
            throw new RequiredError('paymentMethod','Required parameter paymentMethod was null or undefined when calling offerUpdate.');
        }
        // verify required parameter 'paymentWindow' is not null or undefined
        if (paymentWindow === null || paymentWindow === undefined) {
            throw new RequiredError('paymentWindow','Required parameter paymentWindow was null or undefined when calling offerUpdate.');
        }
        // verify required parameter 'paymentCountry' is not null or undefined
        if (paymentCountry === null || paymentCountry === undefined) {
            throw new RequiredError('paymentCountry','Required parameter paymentCountry was null or undefined when calling offerUpdate.');
        }
        // verify required parameter 'predefinedAmount' is not null or undefined
        if (predefinedAmount === null || predefinedAmount === undefined) {
            throw new RequiredError('predefinedAmount','Required parameter predefinedAmount was null or undefined when calling offerUpdate.');
        }
        // verify required parameter 'paymentMethodGroup' is not null or undefined
        if (paymentMethodGroup === null || paymentMethodGroup === undefined) {
            throw new RequiredError('paymentMethodGroup','Required parameter paymentMethodGroup was null or undefined when calling offerUpdate.');
        }
        // verify required parameter 'paymentMethodLabel' is not null or undefined
        if (paymentMethodLabel === null || paymentMethodLabel === undefined) {
            throw new RequiredError('paymentMethodLabel','Required parameter paymentMethodLabel was null or undefined when calling offerUpdate.');
        }
        // verify required parameter 'bankReferenceMessage' is not null or undefined
        if (bankReferenceMessage === null || bankReferenceMessage === undefined) {
            throw new RequiredError('bankReferenceMessage','Required parameter bankReferenceMessage was null or undefined when calling offerUpdate.');
        }
        // verify required parameter 'showOnlyTrustedUser' is not null or undefined
        if (showOnlyTrustedUser === null || showOnlyTrustedUser === undefined) {
            throw new RequiredError('showOnlyTrustedUser','Required parameter showOnlyTrustedUser was null or undefined when calling offerUpdate.');
        }
        // verify required parameter 'countryLimitationList' is not null or undefined
        if (countryLimitationList === null || countryLimitationList === undefined) {
            throw new RequiredError('countryLimitationList','Required parameter countryLimitationList was null or undefined when calling offerUpdate.');
        }
        // verify required parameter 'countryLimitationType' is not null or undefined
        if (countryLimitationType === null || countryLimitationType === undefined) {
            throw new RequiredError('countryLimitationType','Required parameter countryLimitationType was null or undefined when calling offerUpdate.');
        }
        // verify required parameter 'requireMinPastTrades' is not null or undefined
        if (requireMinPastTrades === null || requireMinPastTrades === undefined) {
            throw new RequiredError('requireMinPastTrades','Required parameter requireMinPastTrades was null or undefined when calling offerUpdate.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/offer/update`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (tags !== undefined) {
            localVarFormParams.set('tags', tags as any);
        }

        if (margin !== undefined) {
            localVarFormParams.set('margin', margin as any);
        }

        if (currency !== undefined) {
            localVarFormParams.set('currency', currency as any);
        }

        if (flowType !== undefined) {
            localVarFormParams.set('flow_type', flowType as any);
        }

        if (offerCap !== undefined) {
            localVarFormParams.set('offer_cap', offerCap as any);
        }

        if (rangeMax !== undefined) {
            localVarFormParams.set('range_max', rangeMax as any);
        }

        if (rangeMin !== undefined) {
            localVarFormParams.set('range_min', rangeMin as any);
        }

        if (dutyHours) {
            dutyHours.forEach((element) => {
                localVarFormParams.append('duty_hours', element as any);
            })
        }

        if (offerHash !== undefined) {
            localVarFormParams.set('offer_hash', offerHash as any);
        }

        if (fixedPrice !== undefined) {
            localVarFormParams.set('fixed_price', fixedPrice as any);
        }

        if (locationId !== undefined) {
            localVarFormParams.set('location_id', locationId as any);
        }

        if (offerTerms !== undefined) {
            localVarFormParams.set('offer_terms', offerTerms as any);
        }

        if (bankAccounts !== undefined) {
            localVarFormParams.set('bank_accounts', bankAccounts as any);
        }

        if (tradeDetails !== undefined) {
            localVarFormParams.set('trade_details', tradeDetails as any);
        }

        if (paymentMethod !== undefined) {
            localVarFormParams.set('payment_method', paymentMethod as any);
        }

        if (paymentWindow !== undefined) {
            localVarFormParams.set('payment_window', paymentWindow as any);
        }

        if (paymentCountry !== undefined) {
            localVarFormParams.set('payment_country', paymentCountry as any);
        }

        if (predefinedAmount !== undefined) {
            localVarFormParams.set('predefined_amount', predefinedAmount as any);
        }

        if (paymentMethodGroup !== undefined) {
            localVarFormParams.set('payment_method_group', paymentMethodGroup as any);
        }

        if (paymentMethodLabel !== undefined) {
            localVarFormParams.set('payment_method_label', paymentMethodLabel as any);
        }

        if (bankReferenceMessage !== undefined) {
            localVarFormParams.set('bank_reference_message', bankReferenceMessage as any);
        }

        if (showOnlyTrustedUser !== undefined) {
            localVarFormParams.set('show_only_trusted_user', showOnlyTrustedUser as any);
        }

        if (countryLimitationList !== undefined) {
            localVarFormParams.set('country_limitation_list', countryLimitationList as any);
        }

        if (countryLimitationType !== undefined) {
            localVarFormParams.set('country_limitation_type', countryLimitationType as any);
        }

        if (requireMinPastTrades !== undefined) {
            localVarFormParams.set('require_min_past_trades', requireMinPastTrades as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Updates an offer margin or fixed price value.         Which field to use depends on offer type if it is a fixed price or uses a margin.
     * @summary offer/update-price
     * @param {number} margin A percent that determines differences between market price and the price of the offer.
     * @param {string} offerHash A hash (ID) of the offer.
     * @param {number} fixedPrice Should be used only if the offer is created as a fixed price offer. If this parameter is used then &#x27;margin&#x27; should not be specified.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    offerUpdatePrice(margin: number, offerHash: string, fixedPrice: number, options: any = {}): FetchArgs {
        // verify required parameter 'margin' is not null or undefined
        if (margin === null || margin === undefined) {
            throw new RequiredError('margin','Required parameter margin was null or undefined when calling offerUpdatePrice.');
        }
        // verify required parameter 'offerHash' is not null or undefined
        if (offerHash === null || offerHash === undefined) {
            throw new RequiredError('offerHash','Required parameter offerHash was null or undefined when calling offerUpdatePrice.');
        }
        // verify required parameter 'fixedPrice' is not null or undefined
        if (fixedPrice === null || fixedPrice === undefined) {
            throw new RequiredError('fixedPrice','Required parameter fixedPrice was null or undefined when calling offerUpdatePrice.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/offer/update-price`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (margin !== undefined) {
            localVarFormParams.set('margin', margin as any);
        }

        if (offerHash !== undefined) {
            localVarFormParams.set('offer_hash', offerHash as any);
        }

        if (fixedPrice !== undefined) {
            localVarFormParams.set('fixed_price', fixedPrice as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
};

export type OfferApiOfferActivateParams = {
    /**
     * A hash (ID) of the offer.
     */
    offerHash: string;

}

export type OfferApiOfferAllParams = {
    /**
     * Will return offers of given type without applying a domain logic that &#x27;offer_type&#x27; filter has. If you specify &#x27;sell&#x27; then offers with this type will be returned and so on. See also offer_type filter. Either &#x27;offer_type&#x27; or &#x27;type&#x27; filter needs to be provided. If &#x27;offer_type&#x27; filter is provided then this filter will be ignored. Possible values: &#x27;buy&#x27;, &#x27;sell&#x27;.
     */
    type: string;

    /**
     * A group of payment methods(slug). For a list of available payment method groups please refer to payment-method-group/list endpoint.
     */
    group: string;

    /**
     * How many offers to return.
     */
    limit: number;

    /**
     * An offset for a result.
     */
    offset: number;

    /**
     * Will return offers where this value either fits into trade limits or equals to a predefined amount.
     */
    fiatMin: number;

    /**
     * Deprecated field. Please use location_id.
     */
    geonameId: number;

    /**
     * Search offers with margin less than the value. Ignored when offer is of fixed price.
     */
    marginMax: number;

    /**
     * Search offers with margin greater than the value. Ignored when offer is of fixed price.
     */
    marginMin: number;

    /**
     * If you would like to get offers that you can use &lt;b&gt;to buy crypto&lt;/b&gt;, then in fact you need to see offers &lt;b&gt;where other vendors are selling crypto&lt;/b&gt;, hence you need to specify &#x27;buy&#x27; to get &#x27;sell&#x27; offers and vice versa. If you just would like to get offers filtered by type they have, then you can use &#x27;type&#x27; parameter instead. Either &#x27;offer_type&#x27; or &#x27;type&#x27; filter needs to be provided. If this filter is provided then &#x27;type&#x27; will be ignored.
     */
    offerType: string;

    /**
     * Comma separated list of user types whose offers to return - i.e. power_trader, expert_trader. For a list of all available user types please refer to user/types endpoint. You can also provide “all” value, in this case offers of users of either available type will be returned.
     */
    userTypes: string;

    /**
     * Location id is needed to search
for offers with specific payment methods, e.g. Cash in Person, Gold. If payment method is another - parameter will be ignored.
You can find location ids here: https://www.geonames.org/.
For better experience use locations ids of countries and cities.
     */
    locationId: number;

    /**
     * ISO country code, e.g. &#x27;US&#x27;. Filter offers by available payment methods in the given country. Please use &#x27;WORLDWIDE&#x27; if you want to get offers from all countries.
For authenticated user by default automatically detected country will be used. For non-authenticated user &#x27;US&#x27; will be used. This filter corresponds to &#x27;Offer location&#x27; filter available on marketplace.
     */
    userCountry: string;

    /**
     * 3 letter ISO code for fiat currency. &#x27;USD&#x27; or any other. Case insensitive.
     */
    currencyCode: string;

    /**
     * A slug of the payment method. To see a list of payment method slugs please refer to payment-method/list endpoint.
     */
    paymentMethod: string;

    /**
     * Search offers with trade limit less than the value.
     */
    fiatAmountMax: number;

    /**
     * Search offers with trade limit greater than the value.
     */
    fiatAmountMin: number;

    /**
     * A filter by crypto currency code, default is &#x27;btc&#x27;. For a list of current supported cryptocurrencies please refer to crypto/list endpoint.
     */
    cryptoCurrencyCode: string;

    /**
     * Search offers with fiat price per crypto less than the value.
     */
    fiatFixedPriceMax: number;

    /**
     * Search offers with fiat price per crypto greater than the value.
     */
    fiatFixedPriceMin: number;

}

export type OfferApiOfferCreateParams = {
    /**
     * Comma-separated list of tags. For a list of available tags please refer to offer-tag/list and use &#x27;slug&#x27; parameter.
     */
    tags: string;

    /**
     * A percent that determines differences between market price and the price of the offer.
     */
    margin: number;

    /**
     * 3 letter ISO code for fiat currency. &#x27;USD&#x27; or any other. Case insensitive.
     */
    currency: string;

    /**
     * A flow type for offer.
     */
    flowType: string;

    /**
     * A maximum value of the trade limit, i.e the largest amount of fiat that a trade can be started with. (Minimum value for the field 1).
     */
    rangeMax: number;

    /**
     * A minimum value of the trade limit, i.e the smallest amount of fiat that a trade can be started with. (Minimum value for the field 1).
     */
    rangeMin: number;

    /**
     * Should be used only if the offer is created as a fixed price offer. If this parameter is used then &#x27;margin&#x27; should not be specified.
     */
    fixedPrice: number;

    /**
     * Location id is needed to search for offers with specific payment methods,
e.g. Cash in Person, Gold. If payment method is another - parameter will be ignored.
You can find location ids here: https://www.geonames.org/.
For better experience use locations ids of countries and cities.
     */
    locationId: number;

    /**
     * Terms of the offer for a trade partner. String up to 2500 characters.
     */
    offerTerms: string;

    /**
     * Comma-separated list of bank account UUIDs.
     */
    bankAccounts: string;

    /**
     * Instructions for a trade partner. String up to 2500 characters.
     */
    tradeDetails: string;

    /**
     * Fixes the price of your cryptocurrency, rather than using the market price. If this field is used, then you should also specify a value for &#x27;fixed_price&#x27;.
     */
    isFixedPrice: boolean;

    /**
     * A slug of the payment method. To see a list of payment method slugs please refer to payment-method/list endpoint.
     */
    paymentMethod: string;

    /**
     * How much time the trade partner has to make the payment and click &#x27;Paid&#x27; before the trade is automatically canceled. Integer between 30 to 43200.
     */
    paymentWindow: number;

    /**
     * A cryptocurrency that this offer will use, a code should be specified. For example - btc, eth. If not set, then &#x27;btc&#x27; will be used as a default.
     */
    cryptoCurrency: string;

    /**
     * 3 letter ISO country code (e.g. USA, EST, fra, etc.). If the payment method is country-specific, specify the most relevant country associated with this payment method.
     */
    paymentCountry: string;

    /**
     * An offer type. Possible values: &#x27;buy&#x27;, &#x27;sell&#x27;.
     */
    offerTypeField: string;

    /**
     * Comma-separated predefined amounts of fiat currency, i.e. 20,30,50. If not specified, then a user can enter any amount within the offer range.
     */
    predefinedAmount: string;

    /**
     * A group of payment methods. For a list of available payment method groups please refer to payment-method-group/list endpoint.
     */
    paymentMethodGroup: string;

    /**
     * A bank name will appear after the payment method. Maximum 25 characters and only letters, numbers, and dash. You can write several bank names separated by space. For example: CBS SEB METROPOLITAN ALFA.
     */
    paymentMethodLabel: string;

    /**
     * 
     */
    bankReferenceMessage: OfferUpdateRequestBodyBankReferenceMessage;

    /**
     * The offer will be shown only to users from the trusted list.
     */
    showOnlyTrustedUser: boolean;

    /**
     * Comma-separated list of &#x27;ISO Alpha-2&#x27; country codes.
     */
    countryLimitationList: string;

    /**
     * Type of limitation countries. Valid values are &#x27;allowed&#x27; or &#x27;disallowed&#x27;. If &#x27;allowed&#x27; is used then the offer will be visible ONLY for visitors from countries specified in the &#x27;country_limitation_list&#x27;. If &#x27;disallowed&#x27; is used then this offer will NOT be visible for visitors from countries specified in the &#x27;country_limitation_list&#x27;.
     */
    countryLimitationType: string;

    /**
     * The offer will be shown only to users with a given amount of past trades.
     */
    requireMinPastTrades: number;

}

export type OfferApiOfferDeactivateParams = {
    /**
     * A hash (ID) of the offer.
     */
    offerHash: string;

}

export type OfferApiOfferDeleteParams = {
    /**
     * A hash (ID) of the offer.
     */
    offerHash: string;

}

export type OfferApiOfferGetParams = {
    /**
     * A hash (ID) of the offer.
     */
    offerHash: string;

}

export type OfferApiOfferListParams = {
    /**
     * A filter by active/not active offers, by default all offers are displayed.
     */
    active: boolean;

    /**
     * An offer type. Possible values: &#x27;buy&#x27;, &#x27;sell&#x27;.
     */
    offerType: string;

}

export type OfferApiOfferPriceParams = {
    /**
     * A hash (ID) of the offer.
     */
    offerHash: string;

}

export type OfferApiOfferPricesParams = {
    /**
     * A slug of the payment method. To see a list of payment method slugs please refer to payment-method/list endpoint.
     */
    paymentMethod: string;

}

export type OfferApiOfferTurnOffParams = {
}

export type OfferApiOfferTurnOnParams = {
}

export type OfferApiOfferUpdateParams = {
    /**
     * Comma-separated list of tags. For a list of available tags please refer to offer-tag/list and use &#x27;slug&#x27; parameter.
     */
    tags: string;

    /**
     * A percent that determines differences between market price and the price of the offer.
     */
    margin: number;

    /**
     * 3 letter ISO code of fiat currency, e.g. USD. Case insensitive.
     */
    currency: string;

    /**
     * A flow type for offer.
     */
    flowType: string;

    /**
     * 
     */
    offerCap: OfferUpdateRequestBodyOfferCap;

    /**
     * A maximum value of the trade limit, i.e the largest amount of fiat that a trade can be started with. (Minimum value for the field 1).
     */
    rangeMax: number;

    /**
     * A minimum value of the trade limit, i.e the smallest amount of fiat that a trade can be started with. (Minimum value for the field 1).
     */
    rangeMin: number;

    /**
     * An array of intervals when the offer is active for the week.
     */
    dutyHours: Array<OfferDutyHours>;

    /**
     * A hash (ID) of the offer.
     */
    offerHash: string;

    /**
     * Should be used only if the offer is created as a fixed price offer. If this parameter is used then &#x27;margin&#x27; should not be specified.
     */
    fixedPrice: number;

    /**
     * Location id is needed to search for offers with specific payment methods,
e.g. Cash in Person, Gold. If payment method is another - parameter will be ignored.
You can find location ids here: https://www.geonames.org/.
For better experience use locations ids of countries and cities.
     */
    locationId: number;

    /**
     * Terms of the offer for a trade partner. String up to 2500 characters.
     */
    offerTerms: string;

    /**
     * Comma-separated list of bank account UUIDs.
     */
    bankAccounts: string;

    /**
     * Instructions for a trade partner. String up to 2500 characters.
     */
    tradeDetails: string;

    /**
     * A slug of the payment method. To see a list of payment method slugs please refer to payment-method/list endpoint.
     */
    paymentMethod: string;

    /**
     * How much time the trade partner has to make the payment and click &#x27;Paid&#x27; before the trade is automatically canceled. Integer between 30 to 43200.
     */
    paymentWindow: number;

    /**
     * 3 letter ISO country code (e.g. USA, EST, fra, etc.). If the payment method is country-specific, specify the most relevant country associated with this payment method.
     */
    paymentCountry: string;

    /**
     * Comma-separated predefined amounts of fiat currency, i.e. 20,30,50. If not specified, then a user can enter any amount within the offer range.
     */
    predefinedAmount: string;

    /**
     * A group of payment methods. For a list of available payment method groups please refer to payment-method-group/list endpoint.
     */
    paymentMethodGroup: string;

    /**
     * A bank name will appear after the payment method. Maximum 25 characters and only letters, numbers, and dash. You can write several bank names separated by space, e.g. CBS SEB METROPOLITAN ALFA.
     */
    paymentMethodLabel: string;

    /**
     * 
     */
    bankReferenceMessage: OfferUpdateRequestBodyBankReferenceMessage;

    /**
     * The offer will be shown only to users from the trusted list.
     */
    showOnlyTrustedUser: boolean;

    /**
     * Comma-separated list of &#x27;ISO Alpha-2&#x27; country codes.
     */
    countryLimitationList: string;

    /**
     * Type of limitation countries. Valid values are &#x27;allowed&#x27; or &#x27;disallowed&#x27;. If &#x27;allowed&#x27; is used then the offer will be visible ONLY for visitors from countries specified in the &#x27;country_limitation_list&#x27;. If &#x27;disallowed&#x27; is used then this offer will NOT be visible for visitors from countries specified in the &#x27;country_limitation_list&#x27;.
     */
    countryLimitationType: string;

    /**
     * The offer will be shown only to users with a given amount of past trades.
     */
    requireMinPastTrades: boolean;

}

export type OfferApiOfferUpdatePriceParams = {
    /**
     * A percent that determines differences between market price and the price of the offer.
     */
    margin: number;

    /**
     * A hash (ID) of the offer.
     */
    offerHash: string;

    /**
     * Should be used only if the offer is created as a fixed price offer. If this parameter is used then &#x27;margin&#x27; should not be specified.
     */
    fixedPrice: number;

}


/**
 * OfferApi
 * @export
 * @class OfferApi
 * @extends {BaseAPI}
 */
export class OfferApi extends BaseAPI {
    /**
     * Activate an offer.
     * @summary offer/activate
     * @param { OfferApiOfferActivateParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OfferApi
     */
    public activate(params: OfferApiOfferActivateParams, options?: any): Promise<SuccessTrueResponse> {
        const localVarFetchArgs = OfferApiFetchParamCreator.offerActivate(params?.offerHash, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Fetch offers. Authentication is optional         (replaces deprecated method of /buy-bitcoin?format=json, results are cached for 1 minute).
     * @summary offer/all
     * @param { OfferApiOfferAllParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OfferApi
     */
    public all(params: OfferApiOfferAllParams, options?: any): Promise<InlineResponse2002> {
        const localVarFetchArgs = OfferApiFetchParamCreator.offerAll(params?.type, params?.group, params?.limit, params?.offset, params?.fiatMin, params?.geonameId, params?.marginMax, params?.marginMin, params?.offerType, params?.userTypes, params?.locationId, params?.userCountry, params?.currencyCode, params?.paymentMethod, params?.fiatAmountMax, params?.fiatAmountMin, params?.cryptoCurrencyCode, params?.fiatFixedPriceMax, params?.fiatFixedPriceMin, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Create an offer.
     * @summary offer/create
     * @param { OfferApiOfferCreateParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OfferApi
     */
    public create(params: OfferApiOfferCreateParams, options?: any): Promise<InlineResponse20012> {
        const localVarFetchArgs = OfferApiFetchParamCreator.offerCreate(params?.tags, params?.margin, params?.currency, params?.flowType, params?.rangeMax, params?.rangeMin, params?.fixedPrice, params?.locationId, params?.offerTerms, params?.bankAccounts, params?.tradeDetails, params?.isFixedPrice, params?.paymentMethod, params?.paymentWindow, params?.cryptoCurrency, params?.paymentCountry, params?.offerTypeField, params?.predefinedAmount, params?.paymentMethodGroup, params?.paymentMethodLabel, params?.bankReferenceMessage, params?.showOnlyTrustedUser, params?.countryLimitationList, params?.countryLimitationType, params?.requireMinPastTrades, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Deactivate an offer.
     * @summary offer/deactivate
     * @param { OfferApiOfferDeactivateParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OfferApi
     */
    public deactivate(params: OfferApiOfferDeactivateParams, options?: any): Promise<SuccessTrueResponse> {
        const localVarFetchArgs = OfferApiFetchParamCreator.offerDeactivate(params?.offerHash, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Delete an offer.
     * @summary offer/delete
     * @param { OfferApiOfferDeleteParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OfferApi
     */
    public delete(params: OfferApiOfferDeleteParams, options?: any): Promise<SuccessTrueResponse> {
        const localVarFetchArgs = OfferApiFetchParamCreator.offerDelete(params?.offerHash, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Fetch information for an offer.
     * @summary offer/get
     * @param { OfferApiOfferGetParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OfferApi
     */
    public get(params: OfferApiOfferGetParams, options?: any): Promise<InlineResponse2003> {
        const localVarFetchArgs = OfferApiFetchParamCreator.offerGet(params?.offerHash, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Return all your offers.
     * @summary offer/list
     * @param { OfferApiOfferListParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OfferApi
     */
    public list(params: OfferApiOfferListParams, options?: any): Promise<InlineResponse2006> {
        const localVarFetchArgs = OfferApiFetchParamCreator.offerList(params?.active, params?.offerType, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Return a price for an offer         (if offer happens to be in fiat currency other than USD, then it will be recalculated to it).
     * @summary offer/price
     * @param { OfferApiOfferPriceParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OfferApi
     */
    public price(params: OfferApiOfferPriceParams, options?: any): Promise<InlineResponse20010> {
        const localVarFetchArgs = OfferApiFetchParamCreator.offerPrice(params?.offerHash, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Return all prices for offers for a given payment method.
     * @summary offer/prices
     * @param { OfferApiOfferPricesParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OfferApi
     */
    public prices(params: OfferApiOfferPricesParams, options?: any): Promise<InlineResponse20013> {
        const localVarFetchArgs = OfferApiFetchParamCreator.offerPrices(params?.paymentMethod, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Turn off all your offers.
     * @summary offer/turn-off
     * @param { OfferApiOfferTurnOffParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OfferApi
     */
    public turnOff(options?: any): Promise<InlineResponse20016> {
        const localVarFetchArgs = OfferApiFetchParamCreator.offerTurnOff(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Turn on all your offers.
     * @summary offer/turn-on
     * @param { OfferApiOfferTurnOnParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OfferApi
     */
    public turnOn(options?: any): Promise<InlineResponse20016> {
        const localVarFetchArgs = OfferApiFetchParamCreator.offerTurnOn(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Update an offer.
     * @summary offer/update
     * @param { OfferApiOfferUpdateParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OfferApi
     */
    public update(params: OfferApiOfferUpdateParams, options?: any): Promise<SuccessTrueResponse> {
        const localVarFetchArgs = OfferApiFetchParamCreator.offerUpdate(params?.tags, params?.margin, params?.currency, params?.flowType, params?.offerCap, params?.rangeMax, params?.rangeMin, params?.dutyHours, params?.offerHash, params?.fixedPrice, params?.locationId, params?.offerTerms, params?.bankAccounts, params?.tradeDetails, params?.paymentMethod, params?.paymentWindow, params?.paymentCountry, params?.predefinedAmount, params?.paymentMethodGroup, params?.paymentMethodLabel, params?.bankReferenceMessage, params?.showOnlyTrustedUser, params?.countryLimitationList, params?.countryLimitationType, params?.requireMinPastTrades, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Updates an offer margin or fixed price value.         Which field to use depends on offer type if it is a fixed price or uses a margin.
     * @summary offer/update-price
     * @param { OfferApiOfferUpdatePriceParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OfferApi
     */
    public updatePrice(params: OfferApiOfferUpdatePriceParams, options?: any): Promise<SuccessTrueResponse> {
        const localVarFetchArgs = OfferApiFetchParamCreator.offerUpdatePrice(params?.margin, params?.offerHash, params?.fixedPrice, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

}
/**
 * OfferTagApi - fetch parameter creator
 * @export
 */
export const OfferTagApiFetchParamCreator = {
    /**
     * Fetch all available tags that can be associated with offers.
     * @summary offer-tag/list
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    offerTagList(options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/offer-tag/list`;
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
};

export type OfferTagApiOfferTagListParams = {
}


/**
 * OfferTagApi
 * @export
 * @class OfferTagApi
 * @extends {BaseAPI}
 */
export class OfferTagApi extends BaseAPI {
    /**
     * Fetch all available tags that can be associated with offers.
     * @summary offer-tag/list
     * @param { OfferTagApiOfferTagListParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OfferTagApi
     */
    public list(options?: any): Promise<InlineResponse20017> {
        const localVarFetchArgs = OfferTagApiFetchParamCreator.offerTagList(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

}
/**
 * PaymentMethodApi - fetch parameter creator
 * @export
 */
export const PaymentMethodApiFetchParamCreator = {
    /**
     * Fetch average positive margin for payment methods over last 3 and 10 days. Authentication is optional.
     * @summary payment-method/fee
     * @param {string} slug Payment method slug. For a list of available payment method slugs please refer to payment-method/list endpoint.
     * @param {string} currency Fiat currency code, by default is USD. For a list of supported fiat currencies please refer to currency/list endpoint.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    paymentMethodFee(slug: string, currency: string, options: any = {}): FetchArgs {
        // verify required parameter 'slug' is not null or undefined
        if (slug === null || slug === undefined) {
            throw new RequiredError('slug','Required parameter slug was null or undefined when calling paymentMethodFee.');
        }
        // verify required parameter 'currency' is not null or undefined
        if (currency === null || currency === undefined) {
            throw new RequiredError('currency','Required parameter currency was null or undefined when calling paymentMethodFee.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/payment-method/fee`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (slug !== undefined) {
            localVarFormParams.set('slug', slug as any);
        }

        if (currency !== undefined) {
            localVarFormParams.set('currency', currency as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Fetch a list of available payment method groups. Authentication is optional.
     * @summary payment-method-group/list
     * @param {string} [locale] Locale code, e.g. ru, pt_BR.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    paymentMethodGroupList(locale?: string, options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/payment-method-group/list`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (locale !== undefined) {
            localVarFormParams.set('locale', locale as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Fetch a list of available payment methods. Authentication is optional.
     * @summary payment-method/list
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    paymentMethodList(options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/payment-method/list`;
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
};

export type PaymentMethodApiPaymentMethodFeeParams = {
    /**
     * Payment method slug. For a list of available payment method slugs please refer to payment-method/list endpoint.
     */
    slug: string;

    /**
     * Fiat currency code, by default is USD. For a list of supported fiat currencies please refer to currency/list endpoint.
     */
    currency: string;

}

export type PaymentMethodApiPaymentMethodGroupListParams = {
    /**
     * Locale code, e.g. ru, pt_BR.
     */
    locale?: string;

}

export type PaymentMethodApiPaymentMethodListParams = {
}


/**
 * PaymentMethodApi
 * @export
 * @class PaymentMethodApi
 * @extends {BaseAPI}
 */
export class PaymentMethodApi extends BaseAPI {
    /**
     * Fetch average positive margin for payment methods over last 3 and 10 days. Authentication is optional.
     * @summary payment-method/fee
     * @param { PaymentMethodApiPaymentMethodFeeParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentMethodApi
     */
    public fee(params: PaymentMethodApiPaymentMethodFeeParams, options?: any): Promise<InlineResponse20032> {
        const localVarFetchArgs = PaymentMethodApiFetchParamCreator.paymentMethodFee(params?.slug, params?.currency, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Fetch a list of available payment method groups. Authentication is optional.
     * @summary payment-method-group/list
     * @param { PaymentMethodApiPaymentMethodGroupListParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentMethodApi
     */
    public groupList(params?: PaymentMethodApiPaymentMethodGroupListParams, options?: any): Promise<PaymentMethodGroupResponse> {
        const localVarFetchArgs = PaymentMethodApiFetchParamCreator.paymentMethodGroupList(params?.locale, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Fetch a list of available payment methods. Authentication is optional.
     * @summary payment-method/list
     * @param { PaymentMethodApiPaymentMethodListParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PaymentMethodApi
     */
    public list(options?: any): Promise<PaymentMethodListResponse> {
        const localVarFetchArgs = PaymentMethodApiFetchParamCreator.paymentMethodList(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

}
/**
 * TradeApi - fetch parameter creator
 * @export
 */
export const TradeApiFetchParamCreator = {
    /**
     * Add proof of payments to trade. Method is to be used only for trades with 'Bank Transfer' payment method.
     * @summary trade/add-proof
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    tradeAddProof(options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/trade/add-proof`;
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
     * Cancel a trade.
     * @summary trade/cancel
     * @param {string} tradeHash A hash (ID) of the trade.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    tradeCancel(tradeHash: string, options: any = {}): FetchArgs {
        // verify required parameter 'tradeHash' is not null or undefined
        if (tradeHash === null || tradeHash === undefined) {
            throw new RequiredError('tradeHash','Required parameter tradeHash was null or undefined when calling tradeCancel.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/trade/cancel`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (tradeHash !== undefined) {
            localVarFormParams.set('trade_hash', tradeHash as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Fetch a list of your completed trades, optionally limited by partner username.
     * @summary trade/completed
     * @param {number} page Requested page, by default is 1.
     * @param {string} partner Username of a partner.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    tradeCompleted(page: number, partner: string, options: any = {}): FetchArgs {
        // verify required parameter 'page' is not null or undefined
        if (page === null || page === undefined) {
            throw new RequiredError('page','Required parameter page was null or undefined when calling tradeCompleted.');
        }
        // verify required parameter 'partner' is not null or undefined
        if (partner === null || partner === undefined) {
            throw new RequiredError('partner','Required parameter partner was null or undefined when calling tradeCompleted.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/trade/completed`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (page !== undefined) {
            localVarFormParams.set('page', page as any);
        }

        if (partner !== undefined) {
            localVarFormParams.set('partner', partner as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Open a dispute.
     * @summary trade/dispute
     * @param {string} reason Description of the dispute reason, max length 250 characters.
     * @param {string} tradeHash A hash (ID) of the trade.
     * @param {string} reasonType Type of reason, for available reasons refer to trade/dispute-reasons endpoint.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    tradeDispute(reason: string, tradeHash: string, reasonType: string, options: any = {}): FetchArgs {
        // verify required parameter 'reason' is not null or undefined
        if (reason === null || reason === undefined) {
            throw new RequiredError('reason','Required parameter reason was null or undefined when calling tradeDispute.');
        }
        // verify required parameter 'tradeHash' is not null or undefined
        if (tradeHash === null || tradeHash === undefined) {
            throw new RequiredError('tradeHash','Required parameter tradeHash was null or undefined when calling tradeDispute.');
        }
        // verify required parameter 'reasonType' is not null or undefined
        if (reasonType === null || reasonType === undefined) {
            throw new RequiredError('reasonType','Required parameter reasonType was null or undefined when calling tradeDispute.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/trade/dispute`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (reason !== undefined) {
            localVarFormParams.set('reason', reason as any);
        }

        if (tradeHash !== undefined) {
            localVarFormParams.set('trade_hash', tradeHash as any);
        }

        if (reasonType !== undefined) {
            localVarFormParams.set('reason_type', reasonType as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Fetch a list of available dispute reasons.
     * @summary trade/dispute-reasons
     * @param {string} tradeHash A hash (ID) of the trade.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    tradeDisputeReasons(tradeHash: string, options: any = {}): FetchArgs {
        // verify required parameter 'tradeHash' is not null or undefined
        if (tradeHash === null || tradeHash === undefined) {
            throw new RequiredError('tradeHash','Required parameter tradeHash was null or undefined when calling tradeDisputeReasons.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/trade/dispute-reasons`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (tradeHash !== undefined) {
            localVarFormParams.set('trade_hash', tradeHash as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Fund a deferred escrow trade.
     * @summary trade/fund
     * @param {string} tradeHash A hash (ID) of the trade.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    tradeFund(tradeHash: string, options: any = {}): FetchArgs {
        // verify required parameter 'tradeHash' is not null or undefined
        if (tradeHash === null || tradeHash === undefined) {
            throw new RequiredError('tradeHash','Required parameter tradeHash was null or undefined when calling tradeFund.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/trade/fund`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (tradeHash !== undefined) {
            localVarFormParams.set('trade_hash', tradeHash as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Fetch information for an active/completed trade.
     * @summary trade/get
     * @param {string} tradeHash A hash (ID) of the trade.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    tradeGet(tradeHash: string, options: any = {}): FetchArgs {
        // verify required parameter 'tradeHash' is not null or undefined
        if (tradeHash === null || tradeHash === undefined) {
            throw new RequiredError('tradeHash','Required parameter tradeHash was null or undefined when calling tradeGet.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/trade/get`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (tradeHash !== undefined) {
            localVarFormParams.set('trade_hash', tradeHash as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * List all your currently active trades.
     * @summary trade/list
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    tradeList(options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/trade/list`;
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
     * Fetch information for seller and buyer locations in a trade.     Restricted: User requesting the information must be a trade partner.
     * @summary trade/locations
     * @param {string} tradeHash A hash (ID) of the trade.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    tradeLocations(tradeHash: string, options: any = {}): FetchArgs {
        // verify required parameter 'tradeHash' is not null or undefined
        if (tradeHash === null || tradeHash === undefined) {
            throw new RequiredError('tradeHash','Required parameter tradeHash was null or undefined when calling tradeLocations.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/trade/locations`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (tradeHash !== undefined) {
            localVarFormParams.set('trade_hash', tradeHash as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Mark trade as PAID.
     * @summary trade/paid
     * @param {string} tradeHash A hash (ID) of the trade.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    tradePaid(tradeHash: string, options: any = {}): FetchArgs {
        // verify required parameter 'tradeHash' is not null or undefined
        if (tradeHash === null || tradeHash === undefined) {
            throw new RequiredError('tradeHash','Required parameter tradeHash was null or undefined when calling tradePaid.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/trade/paid`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (tradeHash !== undefined) {
            localVarFormParams.set('trade_hash', tradeHash as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Release crypto for a trade.
     * @summary trade/release
     * @param {string} tradeHash A hash (ID) of the trade.
     * @param {string} [xPaxful2fa] If the endpoint is invoked with an access key which has been received using Sign in with     Paxful authorization flow and it happens that a user has 2FA enabled then you need to provide a code that you have     received from a user using this header.     The flow may look like this: you invoke trade/release endpoint, if you receive 1006 response code, that means user     has 2FA enabled, in this case in your application you prompt a user to provide you with a code.     Once you have received it, you issue trade/release once again and provide the code in this header.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    tradeRelease(tradeHash: string, xPaxful2fa?: string, options: any = {}): FetchArgs {
        // verify required parameter 'tradeHash' is not null or undefined
        if (tradeHash === null || tradeHash === undefined) {
            throw new RequiredError('tradeHash','Required parameter tradeHash was null or undefined when calling tradeRelease.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/trade/release`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (xPaxful2fa !== undefined && xPaxful2fa !== null) {
            localVarHeaderParameter['x-paxful-2fa'] = String(xPaxful2fa);
        }

        if (tradeHash !== undefined) {
            localVarFormParams.set('trade_hash', tradeHash as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Reopen trade.
     * @summary trade/reopen
     * @param {string} tradeHash A hash (ID) of the trade.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    tradeReopen(tradeHash: string, options: any = {}): FetchArgs {
        // verify required parameter 'tradeHash' is not null or undefined
        if (tradeHash === null || tradeHash === undefined) {
            throw new RequiredError('tradeHash','Required parameter tradeHash was null or undefined when calling tradeReopen.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/trade/reopen`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (tradeHash !== undefined) {
            localVarFormParams.set('trade_hash', tradeHash as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Start a trade.
     * @summary trade/start
     * @param {number} fiat Trade amount in fiat currency.
     * @param {number} satoshi Deprecated. Please use crypto_amount instead.
     * @param {string} offerHash A hash (ID) of an offer.
     * @param {Array<RequestBodyTradeStartBankAccounts>} bankAccounts Bank accounts that will be used for a given trade.
     * @param {number} cryptoAmount Trade amount in cryptocurrency. For BTC trade in Satoshi, for ETH trade in GWEI, for USDT trade in micro cents (e.g 1 usdt &#x3D; 1000000 micro cents).
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    tradeStart(fiat: number, satoshi: number, offerHash: string, bankAccounts: Array<RequestBodyTradeStartBankAccounts>, cryptoAmount: number, options: any = {}): FetchArgs {
        // verify required parameter 'fiat' is not null or undefined
        if (fiat === null || fiat === undefined) {
            throw new RequiredError('fiat','Required parameter fiat was null or undefined when calling tradeStart.');
        }
        // verify required parameter 'satoshi' is not null or undefined
        if (satoshi === null || satoshi === undefined) {
            throw new RequiredError('satoshi','Required parameter satoshi was null or undefined when calling tradeStart.');
        }
        // verify required parameter 'offerHash' is not null or undefined
        if (offerHash === null || offerHash === undefined) {
            throw new RequiredError('offerHash','Required parameter offerHash was null or undefined when calling tradeStart.');
        }
        // verify required parameter 'bankAccounts' is not null or undefined
        if (bankAccounts === null || bankAccounts === undefined) {
            throw new RequiredError('bankAccounts','Required parameter bankAccounts was null or undefined when calling tradeStart.');
        }
        // verify required parameter 'cryptoAmount' is not null or undefined
        if (cryptoAmount === null || cryptoAmount === undefined) {
            throw new RequiredError('cryptoAmount','Required parameter cryptoAmount was null or undefined when calling tradeStart.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/trade/start`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (fiat !== undefined) {
            localVarFormParams.set('fiat', fiat as any);
        }

        if (satoshi !== undefined) {
            localVarFormParams.set('satoshi', satoshi as any);
        }

        if (offerHash !== undefined) {
            localVarFormParams.set('offer_hash', offerHash as any);
        }

        if (bankAccounts) {
            bankAccounts.forEach((element) => {
                localVarFormParams.append('bank_accounts', element as any);
            })
        }

        if (cryptoAmount !== undefined) {
            localVarFormParams.set('crypto_amount', cryptoAmount as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Use bank account to the trade. Method is to be used only for trades with 'Bank Transfer' payment method.
     * @summary trade/use-bank-account
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    tradeUseBankAccount(options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/trade/use-bank-account`;
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
};

export type TradeApiTradeAddProofParams = {
}

export type TradeApiTradeCancelParams = {
    /**
     * A hash (ID) of the trade.
     */
    tradeHash: string;

}

export type TradeApiTradeCompletedParams = {
    /**
     * Requested page, by default is 1.
     */
    page: number;

    /**
     * Username of a partner.
     */
    partner: string;

}

export type TradeApiTradeDisputeParams = {
    /**
     * Description of the dispute reason, max length 250 characters.
     */
    reason: string;

    /**
     * A hash (ID) of the trade.
     */
    tradeHash: string;

    /**
     * Type of reason, for available reasons refer to trade/dispute-reasons endpoint.
     */
    reasonType: string;

}

export type TradeApiTradeDisputeReasonsParams = {
    /**
     * A hash (ID) of the trade.
     */
    tradeHash: string;

}

export type TradeApiTradeFundParams = {
    /**
     * A hash (ID) of the trade.
     */
    tradeHash: string;

}

export type TradeApiTradeGetParams = {
    /**
     * A hash (ID) of the trade.
     */
    tradeHash: string;

}

export type TradeApiTradeListParams = {
}

export type TradeApiTradeLocationsParams = {
    /**
     * A hash (ID) of the trade.
     */
    tradeHash: string;

}

export type TradeApiTradePaidParams = {
    /**
     * A hash (ID) of the trade.
     */
    tradeHash: string;

}

export type TradeApiTradeReleaseParams = {
    /**
     * A hash (ID) of the trade.
     */
    tradeHash: string;

    /**
     * If the endpoint is invoked with an access key which has been received using Sign in with     Paxful authorization flow and it happens that a user has 2FA enabled then you need to provide a code that you have     received from a user using this header.     The flow may look like this: you invoke trade/release endpoint, if you receive 1006 response code, that means user     has 2FA enabled, in this case in your application you prompt a user to provide you with a code.     Once you have received it, you issue trade/release once again and provide the code in this header.
     */
    xPaxful2fa?: string;

}

export type TradeApiTradeReopenParams = {
    /**
     * A hash (ID) of the trade.
     */
    tradeHash: string;

}

export type TradeApiTradeStartParams = {
    /**
     * Trade amount in fiat currency.
     */
    fiat: number;

    /**
     * Deprecated. Please use crypto_amount instead.
     */
    satoshi: number;

    /**
     * A hash (ID) of an offer.
     */
    offerHash: string;

    /**
     * Bank accounts that will be used for a given trade.
     */
    bankAccounts: Array<RequestBodyTradeStartBankAccounts>;

    /**
     * Trade amount in cryptocurrency. For BTC trade in Satoshi, for ETH trade in GWEI, for USDT trade in micro cents (e.g 1 usdt &#x3D; 1000000 micro cents).
     */
    cryptoAmount: number;

}

export type TradeApiTradeUseBankAccountParams = {
}


/**
 * TradeApi
 * @export
 * @class TradeApi
 * @extends {BaseAPI}
 */
export class TradeApi extends BaseAPI {
    /**
     * Add proof of payments to trade. Method is to be used only for trades with 'Bank Transfer' payment method.
     * @summary trade/add-proof
     * @param { TradeApiTradeAddProofParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TradeApi
     */
    public addProof(options?: any): Promise<SuccessTrueResponse> {
        const localVarFetchArgs = TradeApiFetchParamCreator.tradeAddProof(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Cancel a trade.
     * @summary trade/cancel
     * @param { TradeApiTradeCancelParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TradeApi
     */
    public cancel(params: TradeApiTradeCancelParams, options?: any): Promise<SuccessTrueResponse> {
        const localVarFetchArgs = TradeApiFetchParamCreator.tradeCancel(params?.tradeHash, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Fetch a list of your completed trades, optionally limited by partner username.
     * @summary trade/completed
     * @param { TradeApiTradeCompletedParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TradeApi
     */
    public completed(params: TradeApiTradeCompletedParams, options?: any): Promise<InlineResponse20023> {
        const localVarFetchArgs = TradeApiFetchParamCreator.tradeCompleted(params?.page, params?.partner, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Open a dispute.
     * @summary trade/dispute
     * @param { TradeApiTradeDisputeParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TradeApi
     */
    public dispute(params: TradeApiTradeDisputeParams, options?: any): Promise<SuccessTrueResponse> {
        const localVarFetchArgs = TradeApiFetchParamCreator.tradeDispute(params?.reason, params?.tradeHash, params?.reasonType, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Fetch a list of available dispute reasons.
     * @summary trade/dispute-reasons
     * @param { TradeApiTradeDisputeReasonsParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TradeApi
     */
    public disputeReasons(params: TradeApiTradeDisputeReasonsParams, options?: any): Promise<InlineResponse20035> {
        const localVarFetchArgs = TradeApiFetchParamCreator.tradeDisputeReasons(params?.tradeHash, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Fund a deferred escrow trade.
     * @summary trade/fund
     * @param { TradeApiTradeFundParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TradeApi
     */
    public fund(params: TradeApiTradeFundParams, options?: any): Promise<SuccessTrueResponse> {
        const localVarFetchArgs = TradeApiFetchParamCreator.tradeFund(params?.tradeHash, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Fetch information for an active/completed trade.
     * @summary trade/get
     * @param { TradeApiTradeGetParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TradeApi
     */
    public get(params: TradeApiTradeGetParams, options?: any): Promise<InlineResponse2004> {
        const localVarFetchArgs = TradeApiFetchParamCreator.tradeGet(params?.tradeHash, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * List all your currently active trades.
     * @summary trade/list
     * @param { TradeApiTradeListParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TradeApi
     */
    public list(options?: any): Promise<InlineResponse2007> {
        const localVarFetchArgs = TradeApiFetchParamCreator.tradeList(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Fetch information for seller and buyer locations in a trade.     Restricted: User requesting the information must be a trade partner.
     * @summary trade/locations
     * @param { TradeApiTradeLocationsParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TradeApi
     */
    public locations(params: TradeApiTradeLocationsParams, options?: any): Promise<InlineResponse20024> {
        const localVarFetchArgs = TradeApiFetchParamCreator.tradeLocations(params?.tradeHash, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Mark trade as PAID.
     * @summary trade/paid
     * @param { TradeApiTradePaidParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TradeApi
     */
    public paid(params: TradeApiTradePaidParams, options?: any): Promise<SuccessTrueResponse> {
        const localVarFetchArgs = TradeApiFetchParamCreator.tradePaid(params?.tradeHash, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Release crypto for a trade.
     * @summary trade/release
     * @param { TradeApiTradeReleaseParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TradeApi
     */
    public release(params: TradeApiTradeReleaseParams, options?: any): Promise<SuccessTrueResponse> {
        const localVarFetchArgs = TradeApiFetchParamCreator.tradeRelease(params?.tradeHash, params?.xPaxful2fa, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Reopen trade.
     * @summary trade/reopen
     * @param { TradeApiTradeReopenParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TradeApi
     */
    public reopen(params: TradeApiTradeReopenParams, options?: any): Promise<SuccessTrueResponse> {
        const localVarFetchArgs = TradeApiFetchParamCreator.tradeReopen(params?.tradeHash, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Start a trade.
     * @summary trade/start
     * @param { TradeApiTradeStartParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TradeApi
     */
    public start(params: TradeApiTradeStartParams, options?: any): Promise<InlineResponse20011> {
        const localVarFetchArgs = TradeApiFetchParamCreator.tradeStart(params?.fiat, params?.satoshi, params?.offerHash, params?.bankAccounts, params?.cryptoAmount, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Use bank account to the trade. Method is to be used only for trades with 'Bank Transfer' payment method.
     * @summary trade/use-bank-account
     * @param { TradeApiTradeUseBankAccountParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TradeApi
     */
    public useBankAccount(options?: any): Promise<SuccessTrueResponse> {
        const localVarFetchArgs = TradeApiFetchParamCreator.tradeUseBankAccount(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

}
/**
 * TradeChatApi - fetch parameter creator
 * @export
 */
export const TradeChatApiFetchParamCreator = {
    /**
     * Fetch messages for a trade.
     * @summary trade-chat/get
     * @param {string} tradeHash A hash (ID) of the trade.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    tradeChatGet(tradeHash: string, options: any = {}): FetchArgs {
        // verify required parameter 'tradeHash' is not null or undefined
        if (tradeHash === null || tradeHash === undefined) {
            throw new RequiredError('tradeHash','Required parameter tradeHash was null or undefined when calling tradeChatGet.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/trade-chat/get`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (tradeHash !== undefined) {
            localVarFormParams.set('trade_hash', tradeHash as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Fetch an image attachment from a trade.
     * @summary trade-chat/image
     * @param {string} size Size to fetch, either 1 (original), 2 (full sized) or 3 (thumbnail).
     * @param {string} imageHash Hash ID of an image. To get the hash id please refer to the image_hash parameter in response of the trade-chat/get endpoint.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    tradeChatImage(size: string, imageHash: string, options: any = {}): FetchArgs {
        // verify required parameter 'size' is not null or undefined
        if (size === null || size === undefined) {
            throw new RequiredError('size','Required parameter size was null or undefined when calling tradeChatImage.');
        }
        // verify required parameter 'imageHash' is not null or undefined
        if (imageHash === null || imageHash === undefined) {
            throw new RequiredError('imageHash','Required parameter imageHash was null or undefined when calling tradeChatImage.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/trade-chat/image`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (size !== undefined) {
            localVarFormParams.set('size', size as any);
        }

        if (imageHash !== undefined) {
            localVarFormParams.set('image_hash', imageHash as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Attach image to a trade chat.
     * @summary trade-chat/image/add
     * @param {string} file URL of a publicly accessible file in the Internet. Supported formats are jpeg, png, jpg. Files up to 10mb are only allowed.
When the endpoint is invoked, Paxful will download an image from the specified URL and post it to a given trade chat.
Please consider using image/upload endpoint instead as it will process uploaded image instantly.
     * @param {string} tradeHash A hash (ID) of the trade.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    tradeChatImageAdd(file: string, tradeHash: string, options: any = {}): FetchArgs {
        // verify required parameter 'file' is not null or undefined
        if (file === null || file === undefined) {
            throw new RequiredError('file','Required parameter file was null or undefined when calling tradeChatImageAdd.');
        }
        // verify required parameter 'tradeHash' is not null or undefined
        if (tradeHash === null || tradeHash === undefined) {
            throw new RequiredError('tradeHash','Required parameter tradeHash was null or undefined when calling tradeChatImageAdd.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/trade-chat/image/add`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (file !== undefined) {
            localVarFormParams.set('file', file as any);
        }

        if (tradeHash !== undefined) {
            localVarFormParams.set('trade_hash', tradeHash as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Upload image to a trade chat.      This endpoint can be used only with OAuth 2.0 authentiction method.
     * @summary trade-chat/image/upload
     * @param {Blob} file File to upload. Supported formats are jpeg, png, jpg. Files up to 10mb are only allowed.
     * @param {string} tradeHash A hash (ID) of the trade.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    tradeChatImageUpload(file: Blob, tradeHash: string, options: any = {}): FetchArgs {
        // verify required parameter 'file' is not null or undefined
        if (file === null || file === undefined) {
            throw new RequiredError('file','Required parameter file was null or undefined when calling tradeChatImageUpload.');
        }
        // verify required parameter 'tradeHash' is not null or undefined
        if (tradeHash === null || tradeHash === undefined) {
            throw new RequiredError('tradeHash','Required parameter tradeHash was null or undefined when calling tradeChatImageUpload.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/trade-chat/image/upload`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (file !== undefined) {
            localVarFormParams.set('file', file as any);
        }

        if (tradeHash !== undefined) {
            localVarFormParams.set('trade_hash', tradeHash as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Fetch latest messages for all active trades, or for one trade if trade_hash filter is specified.      Latest messages are messages posted in last 10 minutes.
     * @summary trade-chat/latest
     * @param {string} tradeHash Hash ID of a trade. If specified, method returns latest messages only for this trade. If omitted, the method return latest messages/attachments for all active trades.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    tradeChatLatest(tradeHash: string, options: any = {}): FetchArgs {
        // verify required parameter 'tradeHash' is not null or undefined
        if (tradeHash === null || tradeHash === undefined) {
            throw new RequiredError('tradeHash','Required parameter tradeHash was null or undefined when calling tradeChatLatest.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/trade-chat/latest`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (tradeHash !== undefined) {
            localVarFormParams.set('trade_hash', tradeHash as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Post message to a trade chat.
     * @summary trade-chat/post
     * @param {string} message Message content.
     * @param {string} tradeHash A hash (ID) of the trade.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    tradeChatPost(message: string, tradeHash: string, options: any = {}): FetchArgs {
        // verify required parameter 'message' is not null or undefined
        if (message === null || message === undefined) {
            throw new RequiredError('message','Required parameter message was null or undefined when calling tradeChatPost.');
        }
        // verify required parameter 'tradeHash' is not null or undefined
        if (tradeHash === null || tradeHash === undefined) {
            throw new RequiredError('tradeHash','Required parameter tradeHash was null or undefined when calling tradeChatPost.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/trade-chat/post`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (message !== undefined) {
            localVarFormParams.set('message', message as any);
        }

        if (tradeHash !== undefined) {
            localVarFormParams.set('trade_hash', tradeHash as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
};

export type TradeChatApiTradeChatGetParams = {
    /**
     * A hash (ID) of the trade.
     */
    tradeHash: string;

}

export type TradeChatApiTradeChatImageParams = {
    /**
     * Size to fetch, either 1 (original), 2 (full sized) or 3 (thumbnail).
     */
    size: string;

    /**
     * Hash ID of an image. To get the hash id please refer to the image_hash parameter in response of the trade-chat/get endpoint.
     */
    imageHash: string;

}

export type TradeChatApiTradeChatImageAddParams = {
    /**
     * URL of a publicly accessible file in the Internet. Supported formats are jpeg, png, jpg. Files up to 10mb are only allowed.
When the endpoint is invoked, Paxful will download an image from the specified URL and post it to a given trade chat.
Please consider using image/upload endpoint instead as it will process uploaded image instantly.
     */
    file: string;

    /**
     * A hash (ID) of the trade.
     */
    tradeHash: string;

}

export type TradeChatApiTradeChatImageUploadParams = {
    /**
     * File to upload. Supported formats are jpeg, png, jpg. Files up to 10mb are only allowed.
     */
    file: Blob;

    /**
     * A hash (ID) of the trade.
     */
    tradeHash: string;

}

export type TradeChatApiTradeChatLatestParams = {
    /**
     * Hash ID of a trade. If specified, method returns latest messages only for this trade. If omitted, the method return latest messages/attachments for all active trades.
     */
    tradeHash: string;

}

export type TradeChatApiTradeChatPostParams = {
    /**
     * Message content.
     */
    message: string;

    /**
     * A hash (ID) of the trade.
     */
    tradeHash: string;

}


/**
 * TradeChatApi
 * @export
 * @class TradeChatApi
 * @extends {BaseAPI}
 */
export class TradeChatApi extends BaseAPI {
    /**
     * Fetch messages for a trade.
     * @summary trade-chat/get
     * @param { TradeChatApiTradeChatGetParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TradeChatApi
     */
    public get(params: TradeChatApiTradeChatGetParams, options?: any): Promise<InlineResponse20018> {
        const localVarFetchArgs = TradeChatApiFetchParamCreator.tradeChatGet(params?.tradeHash, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Fetch an image attachment from a trade.
     * @summary trade-chat/image
     * @param { TradeChatApiTradeChatImageParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TradeChatApi
     */
    public image(params: TradeChatApiTradeChatImageParams, options?: any): Promise<Response> {
        const localVarFetchArgs = TradeChatApiFetchParamCreator.tradeChatImage(params?.size, params?.imageHash, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Attach image to a trade chat.
     * @summary trade-chat/image/add
     * @param { TradeChatApiTradeChatImageAddParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TradeChatApi
     */
    public imageAdd(params: TradeChatApiTradeChatImageAddParams, options?: any): Promise<InlineResponse20022> {
        const localVarFetchArgs = TradeChatApiFetchParamCreator.tradeChatImageAdd(params?.file, params?.tradeHash, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Upload image to a trade chat.      This endpoint can be used only with OAuth 2.0 authentiction method.
     * @summary trade-chat/image/upload
     * @param { TradeChatApiTradeChatImageUploadParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TradeChatApi
     */
    public imageUpload(params: TradeChatApiTradeChatImageUploadParams, options?: any): Promise<InlineResponse20022> {
        const localVarFetchArgs = TradeChatApiFetchParamCreator.tradeChatImageUpload(params?.file, params?.tradeHash, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Fetch latest messages for all active trades, or for one trade if trade_hash filter is specified.      Latest messages are messages posted in last 10 minutes.
     * @summary trade-chat/latest
     * @param { TradeChatApiTradeChatLatestParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TradeChatApi
     */
    public latest(params: TradeChatApiTradeChatLatestParams, options?: any): Promise<InlineResponse20028> {
        const localVarFetchArgs = TradeChatApiFetchParamCreator.tradeChatLatest(params?.tradeHash, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Post message to a trade chat.
     * @summary trade-chat/post
     * @param { TradeChatApiTradeChatPostParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TradeChatApi
     */
    public post(params: TradeChatApiTradeChatPostParams, options?: any): Promise<InlineResponse20022> {
        const localVarFetchArgs = TradeChatApiFetchParamCreator.tradeChatPost(params?.message, params?.tradeHash, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

}
/**
 * TransactionsApi - fetch parameter creator
 * @export
 */
export const TransactionsApiFetchParamCreator = {
    /**
     * Fetch a list of your transactions, optionally filtered by type.
     * @summary transactions/all
     * @param {number} page Requested page, by default is 1.
     * @param {string} type Type of transaction. Possible values: &#x27;trade&#x27;, &#x27;non-trade&#x27;, &#x27;received&#x27;, &#x27;received-internal&#x27;, &#x27;received-external&#x27;, &#x27;sent&#x27;, &#x27;sent-internal&#x27;, &#x27;sent-external&#x27;, &#x27;hedging&#x27;, &#x27;all&#x27;. By default is &#x27;all&#x27;.
     * @param {number} limit A number of transactions to return. By default is 100.
     * @param {string} cryptoCurrencyCode Filter by cryptocurrency code. Use &#x27;all&#x27; value to get a list of transactions with all supported cryptocurrencies. Default is btc. For a list of current supported cryptocurrencies please refer to crypto/list endpoint.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    transactionsAll(page: number, type: string, limit: number, cryptoCurrencyCode: string, options: any = {}): FetchArgs {
        // verify required parameter 'page' is not null or undefined
        if (page === null || page === undefined) {
            throw new RequiredError('page','Required parameter page was null or undefined when calling transactionsAll.');
        }
        // verify required parameter 'type' is not null or undefined
        if (type === null || type === undefined) {
            throw new RequiredError('type','Required parameter type was null or undefined when calling transactionsAll.');
        }
        // verify required parameter 'limit' is not null or undefined
        if (limit === null || limit === undefined) {
            throw new RequiredError('limit','Required parameter limit was null or undefined when calling transactionsAll.');
        }
        // verify required parameter 'cryptoCurrencyCode' is not null or undefined
        if (cryptoCurrencyCode === null || cryptoCurrencyCode === undefined) {
            throw new RequiredError('cryptoCurrencyCode','Required parameter cryptoCurrencyCode was null or undefined when calling transactionsAll.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/transactions/all`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (page !== undefined) {
            localVarFormParams.set('page', page as any);
        }

        if (type !== undefined) {
            localVarFormParams.set('type', type as any);
        }

        if (limit !== undefined) {
            localVarFormParams.set('limit', limit as any);
        }

        if (cryptoCurrencyCode !== undefined) {
            localVarFormParams.set('crypto_currency_code', cryptoCurrencyCode as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
};

export type TransactionsApiTransactionsAllParams = {
    /**
     * Requested page, by default is 1.
     */
    page: number;

    /**
     * Type of transaction. Possible values: &#x27;trade&#x27;, &#x27;non-trade&#x27;, &#x27;received&#x27;, &#x27;received-internal&#x27;, &#x27;received-external&#x27;, &#x27;sent&#x27;, &#x27;sent-internal&#x27;, &#x27;sent-external&#x27;, &#x27;hedging&#x27;, &#x27;all&#x27;. By default is &#x27;all&#x27;.
     */
    type: string;

    /**
     * A number of transactions to return. By default is 100.
     */
    limit: number;

    /**
     * Filter by cryptocurrency code. Use &#x27;all&#x27; value to get a list of transactions with all supported cryptocurrencies. Default is btc. For a list of current supported cryptocurrencies please refer to crypto/list endpoint.
     */
    cryptoCurrencyCode: string;

}


/**
 * TransactionsApi
 * @export
 * @class TransactionsApi
 * @extends {BaseAPI}
 */
export class TransactionsApi extends BaseAPI {
    /**
     * Fetch a list of your transactions, optionally filtered by type.
     * @summary transactions/all
     * @param { TransactionsApiTransactionsAllParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TransactionsApi
     */
    public all(params: TransactionsApiTransactionsAllParams, options?: any): Promise<InlineResponse20026> {
        const localVarFetchArgs = TransactionsApiFetchParamCreator.transactionsAll(params?.page, params?.type, params?.limit, params?.cryptoCurrencyCode, options);
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
     * Fetch information for a current user.
     * @summary user/me
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    currentUser(options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/user/me`;
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
     * Get user affiliate info
     * @summary user/affiliate
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    userAffiliate(options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/user/affiliate`;
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
     * Add username to blocked list
     * @summary user/block
     * @param {string} username Username of the user.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    userBlock(username: string, options: any = {}): FetchArgs {
        // verify required parameter 'username' is not null or undefined
        if (username === null || username === undefined) {
            throw new RequiredError('username','Required parameter username was null or undefined when calling userBlock.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/user/block`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (username !== undefined) {
            localVarFormParams.set('username', username as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Fetch a list of your blocked users.
     * @summary user/blocked-list
     * @param {number} [page] Requested page, by default is 1.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    userBlockedList(page?: number, options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/user/blocked-list`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (page !== undefined) {
            localVarFormParams.set('page', page as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Fetch information for a user.
     * @summary user/info
     * @param {string} username Username of the user.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    userInfo(username: string, options: any = {}): FetchArgs {
        // verify required parameter 'username' is not null or undefined
        if (username === null || username === undefined) {
            throw new RequiredError('username','Required parameter username was null or undefined when calling userInfo.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/user/info`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (username !== undefined) {
            localVarFormParams.set('username', username as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Deprecated. You don't need to use this endpoint directly, last seen time is going to be updated     automatically if you use other API endpoints.     Refresh your last seen time. This endpoint has its own rate limit and is limited to 360 requests per hour     (every 10 second max).
     * @summary user/touch
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    userTouch(options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/user/touch`;
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
     * Add username to the trusted user list.
     * @summary user/trust
     * @param {string} username Username of the user.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    userTrust(username: string, options: any = {}): FetchArgs {
        // verify required parameter 'username' is not null or undefined
        if (username === null || username === undefined) {
            throw new RequiredError('username','Required parameter username was null or undefined when calling userTrust.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/user/trust`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (username !== undefined) {
            localVarFormParams.set('username', username as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Returns a list of available user types. For example - power_trader, expert_trader, etc.      This parameter can be used as “user_type” in offer/all endpoint.
     * @summary user/types
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    userTypes(options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/user/types`;
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
     * Remove user from blocked list.
     * @summary user/unblock
     * @param {string} username Username of the user.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    userUnblock(username: string, options: any = {}): FetchArgs {
        // verify required parameter 'username' is not null or undefined
        if (username === null || username === undefined) {
            throw new RequiredError('username','Required parameter username was null or undefined when calling userUnblock.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/user/unblock`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (username !== undefined) {
            localVarFormParams.set('username', username as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Remove username from the trusted list.
     * @summary user/untrust
     * @param {string} username Username of the user.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    userUntrust(username: string, options: any = {}): FetchArgs {
        // verify required parameter 'username' is not null or undefined
        if (username === null || username === undefined) {
            throw new RequiredError('username','Required parameter username was null or undefined when calling userUntrust.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/user/untrust`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (username !== undefined) {
            localVarFormParams.set('username', username as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
};

export type UserApiCurrentUserParams = {
}

export type UserApiUserAffiliateParams = {
}

export type UserApiUserBlockParams = {
    /**
     * Username of the user.
     */
    username: string;

}

export type UserApiUserBlockedListParams = {
    /**
     * Requested page, by default is 1.
     */
    page?: number;

}

export type UserApiUserInfoParams = {
    /**
     * Username of the user.
     */
    username: string;

}

export type UserApiUserTouchParams = {
}

export type UserApiUserTrustParams = {
    /**
     * Username of the user.
     */
    username: string;

}

export type UserApiUserTypesParams = {
}

export type UserApiUserUnblockParams = {
    /**
     * Username of the user.
     */
    username: string;

}

export type UserApiUserUntrustParams = {
    /**
     * Username of the user.
     */
    username: string;

}


/**
 * UserApi
 * @export
 * @class UserApi
 * @extends {BaseAPI}
 */
export class UserApi extends BaseAPI {
    /**
     * Fetch information for a current user.
     * @summary user/me
     * @param { UserApiCurrentUserParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public currentUser(options?: any): Promise<InlineResponse200> {
        const localVarFetchArgs = UserApiFetchParamCreator.currentUser(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Get user affiliate info
     * @summary user/affiliate
     * @param { UserApiUserAffiliateParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public affiliate(options?: any): Promise<InlineResponse20019> {
        const localVarFetchArgs = UserApiFetchParamCreator.userAffiliate(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Add username to blocked list
     * @summary user/block
     * @param { UserApiUserBlockParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public block(params: UserApiUserBlockParams, options?: any): Promise<SuccessResponse> {
        const localVarFetchArgs = UserApiFetchParamCreator.userBlock(params?.username, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Fetch a list of your blocked users.
     * @summary user/blocked-list
     * @param { UserApiUserBlockedListParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public blockedList(params?: UserApiUserBlockedListParams, options?: any): Promise<InlineResponse20029> {
        const localVarFetchArgs = UserApiFetchParamCreator.userBlockedList(params?.page, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Fetch information for a user.
     * @summary user/info
     * @param { UserApiUserInfoParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public info(params: UserApiUserInfoParams, options?: any): Promise<InlineResponse2005> {
        const localVarFetchArgs = UserApiFetchParamCreator.userInfo(params?.username, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Deprecated. You don't need to use this endpoint directly, last seen time is going to be updated     automatically if you use other API endpoints.     Refresh your last seen time. This endpoint has its own rate limit and is limited to 360 requests per hour     (every 10 second max).
     * @summary user/touch
     * @param { UserApiUserTouchParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public touch(options?: any): Promise<SuccessResponse> {
        const localVarFetchArgs = UserApiFetchParamCreator.userTouch(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Add username to the trusted user list.
     * @summary user/trust
     * @param { UserApiUserTrustParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public trust(params: UserApiUserTrustParams, options?: any): Promise<SuccessResponse> {
        const localVarFetchArgs = UserApiFetchParamCreator.userTrust(params?.username, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Returns a list of available user types. For example - power_trader, expert_trader, etc.      This parameter can be used as “user_type” in offer/all endpoint.
     * @summary user/types
     * @param { UserApiUserTypesParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public types(options?: any): Promise<InlineResponse2008> {
        const localVarFetchArgs = UserApiFetchParamCreator.userTypes(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Remove user from blocked list.
     * @summary user/unblock
     * @param { UserApiUserUnblockParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public unblock(params: UserApiUserUnblockParams, options?: any): Promise<SuccessResponse> {
        const localVarFetchArgs = UserApiFetchParamCreator.userUnblock(params?.username, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Remove username from the trusted list.
     * @summary user/untrust
     * @param { UserApiUserUntrustParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public untrust(params: UserApiUserUntrustParams, options?: any): Promise<SuccessResponse> {
        const localVarFetchArgs = UserApiFetchParamCreator.userUntrust(params?.username, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

}
/**
 * WalletApi - fetch parameter creator
 * @export
 */
export const WalletApiFetchParamCreator = {
    /**
     * Fetch an user balance.
     * @summary wallet/balance
     * @param {string} cryptoCurrencyCode Cryptocurrency code of balance. By default - BTC. For a list of current supported cryptocurrencies please refer to crypto/list endpoint.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    walletBalance(cryptoCurrencyCode: string, options: any = {}): FetchArgs {
        // verify required parameter 'cryptoCurrencyCode' is not null or undefined
        if (cryptoCurrencyCode === null || cryptoCurrencyCode === undefined) {
            throw new RequiredError('cryptoCurrencyCode','Required parameter cryptoCurrencyCode was null or undefined when calling walletBalance.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/wallet/balance`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (cryptoCurrencyCode !== undefined) {
            localVarFormParams.set('crypto_currency_code', cryptoCurrencyCode as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Get the current conversion quotes for supported crypto currency pairs.
     * @summary wallet/conversion-quotes
     * @param {string} convertTo Cryptocurrency to convert to. For a list of current supported cryptocurrencies please refer to crypto/list endpoint.
     * @param {string} convertFrom Cryptocurrency to convert from. For a list of current supported cryptocurrencies please refer to crypto/list endpoint.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    walletConversionQuotes(convertTo: string, convertFrom: string, options: any = {}): FetchArgs {
        // verify required parameter 'convertTo' is not null or undefined
        if (convertTo === null || convertTo === undefined) {
            throw new RequiredError('convertTo','Required parameter convertTo was null or undefined when calling walletConversionQuotes.');
        }
        // verify required parameter 'convertFrom' is not null or undefined
        if (convertFrom === null || convertFrom === undefined) {
            throw new RequiredError('convertFrom','Required parameter convertFrom was null or undefined when calling walletConversionQuotes.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/wallet/conversion-quotes`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (convertTo !== undefined) {
            localVarFormParams.set('convert_to', convertTo as any);
        }

        if (convertFrom !== undefined) {
            localVarFormParams.set('convert_from', convertFrom as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Convert from one crypto currency to another.
     * @summary wallet/convert
     * @param {number} amount Amount to convert in cryptocurrency. For BTC in Satoshi, for ETH in GWEI, for USDT in micro cents, e.g. 1 USDT &#x3D; 1000000 micro cents.
     * @param {string} orderId Unique ID (UUID) of the conversion, that your application needs to generate.
Having this parameter ensures idempotency of the operation - you can invoke the endpoint as many times with the same parameter, but conversion will be executed only once.
This helps to avoid accidental double conversions.
     * @param {string} quoteId Value for this field can be fetched using wallet/conversion-quotes endpoint.
     * @param {string} convertTo Cryptocurrency to convert to. For a list of current supported cryptocurrencies please refer to crypto/list endpoint.
     * @param {string} convertFrom Cryptocurrency to convert from. For a list of current supported cryptocurrencies please refer to crypto/list endpoint.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    walletConvert(amount: number, orderId: string, quoteId: string, convertTo: string, convertFrom: string, options: any = {}): FetchArgs {
        // verify required parameter 'amount' is not null or undefined
        if (amount === null || amount === undefined) {
            throw new RequiredError('amount','Required parameter amount was null or undefined when calling walletConvert.');
        }
        // verify required parameter 'orderId' is not null or undefined
        if (orderId === null || orderId === undefined) {
            throw new RequiredError('orderId','Required parameter orderId was null or undefined when calling walletConvert.');
        }
        // verify required parameter 'quoteId' is not null or undefined
        if (quoteId === null || quoteId === undefined) {
            throw new RequiredError('quoteId','Required parameter quoteId was null or undefined when calling walletConvert.');
        }
        // verify required parameter 'convertTo' is not null or undefined
        if (convertTo === null || convertTo === undefined) {
            throw new RequiredError('convertTo','Required parameter convertTo was null or undefined when calling walletConvert.');
        }
        // verify required parameter 'convertFrom' is not null or undefined
        if (convertFrom === null || convertFrom === undefined) {
            throw new RequiredError('convertFrom','Required parameter convertFrom was null or undefined when calling walletConvert.');
        }
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/wallet/convert`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (amount !== undefined) {
            localVarFormParams.set('amount', amount as any);
        }

        if (orderId !== undefined) {
            localVarFormParams.set('order_id', orderId as any);
        }

        if (quoteId !== undefined) {
            localVarFormParams.set('quote_id', quoteId as any);
        }

        if (convertTo !== undefined) {
            localVarFormParams.set('convert_to', convertTo as any);
        }

        if (convertFrom !== undefined) {
            localVarFormParams.set('convert_from', convertFrom as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Fetch list of your addresses.
     * @summary wallet/list-addresses
     * @param {string} [cryptoCurrencyCode] Cryptocurrency code of the wallet addresses. By default - BTC. For a list of current supported cryptocurrencies please refer to crypto/list endpoint.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    walletListAddresses(cryptoCurrencyCode?: string, options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/wallet/list-addresses`;
        const localVarUrlObj = url.parse(localVarPath, true);
        const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
        const localVarHeaderParameter = {};
        const localVarQueryParameter = {};
        const localVarFormParams = new url.URLSearchParams();
        if (cryptoCurrencyCode !== undefined) {
            localVarFormParams.set('crypto_currency_code', cryptoCurrencyCode as any);
        }

        localVarHeaderParameter['Content-Type'] = 'application/x-www-form-urlencoded';

        localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete localVarUrlObj?.search;
        localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
        localVarRequestOptions.body = localVarFormParams.toString();

        return {
            url: url.format(localVarUrlObj),
            options: localVarRequestOptions,
        };
    },
    /**
     * Generate a new wallet address (currently only BTC is supported).
     * @summary wallet/new-address
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    walletNewAddress(options: any = {}): FetchArgs {
        const localVarPath = `${process.env.PAXFUL_DATA_HOST}/paxful/v1/wallet/new-address`;
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
};

export type WalletApiWalletBalanceParams = {
    /**
     * Cryptocurrency code of balance. By default - BTC. For a list of current supported cryptocurrencies please refer to crypto/list endpoint.
     */
    cryptoCurrencyCode: string;

}

export type WalletApiWalletConversionQuotesParams = {
    /**
     * Cryptocurrency to convert to. For a list of current supported cryptocurrencies please refer to crypto/list endpoint.
     */
    convertTo: string;

    /**
     * Cryptocurrency to convert from. For a list of current supported cryptocurrencies please refer to crypto/list endpoint.
     */
    convertFrom: string;

}

export type WalletApiWalletConvertParams = {
    /**
     * Amount to convert in cryptocurrency. For BTC in Satoshi, for ETH in GWEI, for USDT in micro cents, e.g. 1 USDT &#x3D; 1000000 micro cents.
     */
    amount: number;

    /**
     * Unique ID (UUID) of the conversion, that your application needs to generate.
Having this parameter ensures idempotency of the operation - you can invoke the endpoint as many times with the same parameter, but conversion will be executed only once.
This helps to avoid accidental double conversions.
     */
    orderId: string;

    /**
     * Value for this field can be fetched using wallet/conversion-quotes endpoint.
     */
    quoteId: string;

    /**
     * Cryptocurrency to convert to. For a list of current supported cryptocurrencies please refer to crypto/list endpoint.
     */
    convertTo: string;

    /**
     * Cryptocurrency to convert from. For a list of current supported cryptocurrencies please refer to crypto/list endpoint.
     */
    convertFrom: string;

}

export type WalletApiWalletListAddressesParams = {
    /**
     * Cryptocurrency code of the wallet addresses. By default - BTC. For a list of current supported cryptocurrencies please refer to crypto/list endpoint.
     */
    cryptoCurrencyCode?: string;

}

export type WalletApiWalletNewAddressParams = {
}


/**
 * WalletApi
 * @export
 * @class WalletApi
 * @extends {BaseAPI}
 */
export class WalletApi extends BaseAPI {
    /**
     * Fetch an user balance.
     * @summary wallet/balance
     * @param { WalletApiWalletBalanceParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WalletApi
     */
    public balance(params: WalletApiWalletBalanceParams, options?: any): Promise<InlineResponse20020> {
        const localVarFetchArgs = WalletApiFetchParamCreator.walletBalance(params?.cryptoCurrencyCode, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Get the current conversion quotes for supported crypto currency pairs.
     * @summary wallet/conversion-quotes
     * @param { WalletApiWalletConversionQuotesParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WalletApi
     */
    public conversionQuotes(params: WalletApiWalletConversionQuotesParams, options?: any): Promise<InlineResponse20037> {
        const localVarFetchArgs = WalletApiFetchParamCreator.walletConversionQuotes(params?.convertTo, params?.convertFrom, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Convert from one crypto currency to another.
     * @summary wallet/convert
     * @param { WalletApiWalletConvertParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WalletApi
     */
    public convert(params: WalletApiWalletConvertParams, options?: any): Promise<InlineResponse20021> {
        const localVarFetchArgs = WalletApiFetchParamCreator.walletConvert(params?.amount, params?.orderId, params?.quoteId, params?.convertTo, params?.convertFrom, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Fetch list of your addresses.
     * @summary wallet/list-addresses
     * @param { WalletApiWalletListAddressesParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WalletApi
     */
    public listAddresses(params?: WalletApiWalletListAddressesParams, options?: any): Promise<InlineResponse20036> {
        const localVarFetchArgs = WalletApiFetchParamCreator.walletListAddresses(params?.cryptoCurrencyCode, options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

    /**
     * Generate a new wallet address (currently only BTC is supported).
     * @summary wallet/new-address
     * @param { WalletApiWalletNewAddressParams } params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WalletApi
     */
    public newAddress(options?: any): Promise<InlineResponse20033> {
        const localVarFetchArgs = WalletApiFetchParamCreator.walletNewAddress(options);
        const requestBuilder = new RequestBuilder(localVarFetchArgs.url, localVarFetchArgs.options);
        requestBuilder.acceptJson();

        return executeRequestAuthorized(requestBuilder, this.apiConfiguration, this.credentialStorage);
    }

}

export interface Apis {
    bank: BankApi;
    bankAccount: BankAccountApi;
    currency: CurrencyApi;
    feedback: FeedbackApi;
    kiosk: KioskApi;
    notifications: NotificationsApi;
    offer: OfferApi;
    offerTag: OfferTagApi;
    paymentMethod: PaymentMethodApi;
    trade: TradeApi;
    tradeChat: TradeChatApi;
    transactions: TransactionsApi;
    user: UserApi;
    wallet: WalletApi;
}

export default (configuration: ApiConfiguration, credentialStorage: CredentialStorage): Apis => ({
    bank: new BankApi(configuration, credentialStorage),
    bankAccount: new BankAccountApi(configuration, credentialStorage),
    currency: new CurrencyApi(configuration, credentialStorage),
    feedback: new FeedbackApi(configuration, credentialStorage),
    kiosk: new KioskApi(configuration, credentialStorage),
    notifications: new NotificationsApi(configuration, credentialStorage),
    offer: new OfferApi(configuration, credentialStorage),
    offerTag: new OfferTagApi(configuration, credentialStorage),
    paymentMethod: new PaymentMethodApi(configuration, credentialStorage),
    trade: new TradeApi(configuration, credentialStorage),
    tradeChat: new TradeChatApi(configuration, credentialStorage),
    transactions: new TransactionsApi(configuration, credentialStorage),
    user: new UserApi(configuration, credentialStorage),
    wallet: new WalletApi(configuration, credentialStorage),
})