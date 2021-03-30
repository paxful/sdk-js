import { URL } from "url";
import { Http2ServerResponse } from "http2";

import { ApiConfiguration } from "../ApiConfiguration";

const createOAuthAuthorizeUrl = (
    clientId: string,
    redirectUri: string,
    requestedScope: string[] | undefined
): string => {
    const scope = requestedScope ? requestedScope.join(" ") : "";
    const url = new URL(`${process.env.PAXFUL_OAUTH_HOST}/oauth2/authorize`);
    url.searchParams.append("response_type", "code");
    url.searchParams.append("client_id", clientId);
    url.searchParams.append("redirect_uri", redirectUri);
    url.searchParams.append("scope", scope);
    return url.href;
}

/**
 * Redirects the user for the authorization flow.
 *
 * @param response
 * @param config
 */
export default function authorize(response: Http2ServerResponse, config: ApiConfiguration): void {
    if (!config.redirectUri) {
        throw new Error("Redirect uri is needed for authorization flow.");
    }
    response.statusCode = 301;
    response.writeHead(301, {
        Location: createOAuthAuthorizeUrl(
            config.clientId,
            config.redirectUri,
            config.scope
        )
    });
    response.end();
}
