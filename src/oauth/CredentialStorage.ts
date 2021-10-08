import { Credentials } from "./Credentials";

export declare interface CredentialStorage {
    getCredentials(): Credentials | undefined;

    saveCredentials(credentials: Credentials): Credentials;
}

export class InMemoryCredentialStorage implements CredentialStorage {
    private credentials?: Credentials;

    constructor() {
        // eslint-disable-next-line no-console
        console.warn("WARNING: Please don't use InMemoryCredentialStorage in production. ")
    }

    getCredentials(): Credentials | undefined {
        return this.credentials;
    }

    saveCredentials(credentials: Credentials): Credentials {
        return this.credentials = credentials;
    }
}
