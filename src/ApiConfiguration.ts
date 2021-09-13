import ProxyAgent from "simple-proxy-agent";

/**
 * Configuration needed for use Paxful API.
 * The following params are needed for authorization flow ({@link PaxfulApi/login}
 */
export interface ApiConfiguration {
    /**
     * Client ID generated at developers portal.
     */
    clientId: string;

    /**
     * Client secret generated at developers portal.
     */
    clientSecret: string;

    /**
     * Redirect URI properly registered at developers portal.
     */
    redirectUri?: string;

    /**
     * Scopes needed to interact over the API.
     */
    scope?: string[];

    /**
     * Add a proxy agent to proxy request (accepts http, https and sock proxies)
     */
    proxyAgent?: ProxyAgent;
}
