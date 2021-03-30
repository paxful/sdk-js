import { Credentials } from "./Credentials";

export declare interface CredentialStorage {
    getCredentials(): Credentials;

    saveCredentials(credentials: Credentials): Credentials;
}
