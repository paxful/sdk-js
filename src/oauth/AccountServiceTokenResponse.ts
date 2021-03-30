/**
 * @hidden
 */
export type AccountServiceTokenResponse = {
    token_type: string;
    access_token: string;
    expires_in: number;
    jti: string;
    refresh_token: string;
    scope: string;
};
