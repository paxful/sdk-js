import { Http2ServerResponse } from "http2";
import { ReadStream } from "fs";

import { Profile, Credentials, CredentialStorage } from "./oauth";
import { ApiConfiguration } from "./ApiConfiguration";
import { authorize, retrieveImpersonatedCredentials, retrievePersonalCredentials, getProfile, invoke } from "./commands";

/**
 * Interface responsable for exposing Paxful API integration.
 * @public
 */
export class PaxfulApi {

    private readonly apiConfiguration: ApiConfiguration
    private readonly credentialStorage?: CredentialStorage

    constructor(configuration: ApiConfiguration, credentialStorage?: CredentialStorage) {
        this.apiConfiguration = configuration;
        this.credentialStorage = credentialStorage;
        this.validateAndSetDefaultParameters(configuration);
    }

    /**
     * Redirect the user to authorize the access.
     * @param response
     */
    public login(response: Http2ServerResponse): void {
        return authorize(response, this.apiConfiguration);
    }

    /**
     * Retrieve the tokens with the code generated by {@link PaxfulApi/login}
     * @param code returned by the redirect after user authorizes the application.
     * @return a promise for {@link Credentials}
     */
    public async impersonatedCredentials(code: string): Promise<Credentials> {
        return this.saveToken(
            retrieveImpersonatedCredentials(this.apiConfiguration, code)
        );
    }

    /**
     * Retrieve the tokens for using your own account.
     */
    public async myCredentials(): Promise<Credentials> {
        return this.saveToken(
            retrievePersonalCredentials(this.apiConfiguration)
        );
    }

    /**
     * Get current logged user profile.
     */
    public async getProfile(): Promise<Profile> {
        if(!this.credentialStorage) throw Error("No credentials storage defined.");
        return await getProfile(this.credentialStorage, this.apiConfiguration);
    }

    /**
     * Invokes an API operation on behalf of currently authenticated user.
     *
     * @param url - Url that should be called at api.paxful.com
     * @param payload - (Optional) Payload of the request
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    public invoke(url: string, payload?: Record<string, unknown> | [] | ReadStream | Buffer): Promise<any> {
        return invoke(url, this.apiConfiguration, this.credentialStorage, payload);
    }

    private validateAndSetDefaultParameters(configuration: ApiConfiguration) {
        const defaultOAuthHost = "https://accounts.paxful.com";
        const defaultDataHost = "https://api.paxful.com";
        if (!configuration.scope || configuration.scope.length === 0) {
            this.apiConfiguration.scope = ["profile", "email"];
        }
        if (process.env.PAXFUL_OAUTH_HOST === "") {
            process.env.PAXFUL_OAUTH_HOST = defaultOAuthHost;
        } else {
            process.env.PAXFUL_OAUTH_HOST = process.env.PAXFUL_OAUTH_HOST ?? defaultOAuthHost;
        }
        if (process.env.PAXFUL_DATA_HOST === "" || !process.env.PAXFUL_DATA_HOST) {
            process.env.PAXFUL_DATA_HOST = defaultDataHost;
        } else {
            process.env.PAXFUL_DATA_HOST = process.env.PAXFUL_DATA_HOST ?? defaultDataHost;
        }
    }

    private async saveToken(credentialsPromise: Promise<Credentials>): Promise<Credentials> {
        if(this.credentialStorage) {
            this.credentialStorage.saveCredentials(await credentialsPromise);
        }
        return credentialsPromise;
    }
}
