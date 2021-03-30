/**
 * @packageDocumentation
 * Module that needs to be used to interact with Paxful SDK.
 * See more at {@link usePaxful}.
 */
import { ApiConfiguration } from "./ApiConfiguration";
import { PaxfulApi } from "./PaxfulApi";
import { CredentialStorage } from "./oauth";

/**
 * Function that initializes the Paxful API SDK.
 *
 * To use authorization flow use:
 * ```typescript
 * import usePaxful from "paxful-sdk";
 *
 * const paxfulApi = usePaxful({
 *     clientId: "YOUR CLIENT ID HERE",
 *     clientSecret: "YOUR CLIENT SECRET HERE",
 *     redirectUri: "YOUR REDIRECT URI HERE",
 * //  scope: ["profile", "email"] // Optional variable for passing requested scopes.
 * });
 * ```
 *
 * To use client credentials flow use:
 * ```typescript
 * import usePaxful from "paxful-sdk";
 *
 * const paxfulApi = usePaxful({
 *     clientId: "YOUR CLIENT ID HERE",
 *     clientSecret: "YOUR CLIENT SECRET HERE",
 * //  scope: ["profile", "email"] // Optional variable for passing requested scopes.
 * });
 * ```
 *
 * @param configuration {@link ApiConfiguration} needed to make use of Paxful API
 * @param credentialStorage If you want to persiste the tokens you need to pass a implementation of {@links CredentialStorage}
 * @return {@link PaxfulApi}
 * @public
 */
export default function usePaxful(configuration: ApiConfiguration, credentialStorage?: CredentialStorage): PaxfulApi {
    return new PaxfulApi(configuration, credentialStorage);
}
