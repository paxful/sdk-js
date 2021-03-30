import { URL } from "url";

/**
 * Represents a user profile.
 */
export type Profile = {
    /**
     * Unique external id from the user.
     */
    sub: string;
    nickname: string;
    given_name: string;
    family_name: string;
    locale: string;
    picture: URL;
    email: string;
    email_verified: boolean;
}
