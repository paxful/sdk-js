import {Credentials} from "./Credentials";

export declare interface CredentialStorage {
    getCredentials(): Credentials | undefined;

    saveCredentials(credentials: Credentials): Credentials;
}

export class InMemoryCredentialStorage implements CredentialStorage {
    private credentials?: Credentials;

    getCredentials(): Credentials | undefined {
        return this.credentials;
    }

    saveCredentials(credentials: Credentials): Credentials {
        return this.credentials = credentials;
    }

}
