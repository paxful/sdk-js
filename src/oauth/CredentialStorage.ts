import { Credentials } from "./Credentials";

export declare interface CredentialStorage {
    getCredentials(): Credentials | undefined;

    saveCredentials(credentials: Credentials): Credentials;
}

export class InMemoryCredentialStorage implements CredentialStorage {
    private credentials?: Credentials;

    constructor() {
        // eslint-disable-next-line no-console
        console.warn("Warning: at the moment PaxfulApi is using an InMemoryCredentialsStorage, meaning if you restart your application then access token you have received will be lost and SDK will need to fetch a new one. As a result your requests will have additional latency added to them. For production use please create and use a proper implementation that would store the access token in a persistence storage (i.e. database). For more details please see /README.md file.")
    }

    getCredentials(): Credentials | undefined {
        return this.credentials;
    }

    saveCredentials(credentials: Credentials): Credentials {
        return this.credentials = credentials;
    }
}
