import httpMocks from "node-mocks-http";
import { v4 as UUID } from "uuid";
import fetch from "node-fetch";
import { mock } from 'jest-mock-extended';

import usePaxful from "../";
import { CredentialStorage } from "../oauth";
import { PaxfulApi } from "../PaxfulApi";
import { FetchMockSandbox } from "fetch-mock";

const credentials = {
    clientId: UUID(),
    clientSecret: UUID(),
    redirectUri: "callback"
};

const ttl = 3600;
const expectedTokenAnswer = {
    accessToken: UUID(),
    refreshToken: UUID(),
}

describe("With the Paxful API SDK", function () {

    beforeEach(() => {
        Reflect.set(PaxfulApi, "api", undefined);
        (fetch as unknown as FetchMockSandbox).reset();

        (fetch as unknown as FetchMockSandbox).once({
            url: /oauth2\/token/,
            method: "POST"
        }, {
            status: 200,
            body: JSON.stringify({
                access_token: expectedTokenAnswer.accessToken,
                refresh_token: expectedTokenAnswer.refreshToken,
                expires_in: ttl
            })
        }, {
            sendAsJson: false
        });
    });

    it('SDK points to Paxful production by default', function () {
        process.env.PAXFUL_OAUTH_HOST = "";
        const paxfulApi = usePaxful(credentials);
        const response = httpMocks.createResponse();

        paxfulApi.login(response);
        expect(response.getHeaders().location).toMatch(/https:\/\/accounts.paxful.com/);
    });

    it('I can configure to connect to Paxful', function () {
        const paxfulApi = usePaxful(credentials);
        expect(paxfulApi).toBeDefined();
    });

    it('I can login to have my access authorized', function () {
        const paxfulApi = usePaxful(credentials);

        const response = httpMocks.createResponse();

        paxfulApi.login(response);

        expect(response._getStatusCode()).toBe(302);
        expect(response.getHeaders().location).toMatch(/\/oauth2\/authorize/);
        expect(response.getHeaders().location).toMatch(/response_type=code/);
        expect(response.getHeaders().location).toMatch(/scope=profile\+email/);
        expect(response.getHeaders().location).toMatch(new RegExp(`client_id=${credentials.clientId}`));
        expect(response.getHeaders().location).toMatch(new RegExp(`redirect_uri=${credentials.redirectUri}`));
    });

    it('I receive an error if I dont add a redirect uri for authorization flow', function () {
        const credentialsWithoutUri = {
            ...credentials,
            redirectUri: ""
        }
        const paxfulApi = usePaxful(credentialsWithoutUri);

        const response = httpMocks.createResponse();

        expect(() => {
            paxfulApi.login(response);
        }).toThrowError();
    });

    it('I can get a impersonated access token and refresh token', async function () {
        const paxfulApi = usePaxful(credentials);

        const response = await paxfulApi.impersonatedCredentials(UUID());

        expect(response).toMatchObject(expectedTokenAnswer);
    });

    it('I can save my impersonated tokens', async function () {
        const tokenStorage = mock<CredentialStorage>();
        const paxfulApi = usePaxful(credentials, tokenStorage);

        await paxfulApi.impersonatedCredentials(UUID());

        expect(tokenStorage.saveCredentials).toBeCalled()
    });

    it('I can get my own access token and refresh token', async function () {
        const paxfulApi = usePaxful(credentials);

        const response = await paxfulApi.myCredentials();

        expect(response).toMatchObject(expectedTokenAnswer);
    });

    it('I can save my own tokens', async function () {
        const credentialStorage = mock<CredentialStorage>();
        const paxfulApi = usePaxful(credentials, credentialStorage);

        await paxfulApi.myCredentials();

        expect(credentialStorage.saveCredentials).toBeCalled()
    });

    it('I can get my profile', async function () {
        const userProfile = {
            sub: UUID(),
            nickname: UUID(),
            given_name: UUID(),
            family_name: UUID(),
            locale: "en",
            picture: "https://paxful.com/2/images/avatar.png",
            email: `${UUID()}@paxful.test.com`,
            email_verified: true
        };

        (fetch as unknown as FetchMockSandbox).once({
            url: /oauth2\/userinfo/,
            method: "GET"
        }, {
            status: 200,
            body: JSON.stringify(userProfile)
        }, {
            sendAsJson: false
        });

        const credentialStorage = mock<CredentialStorage>();
        credentialStorage.getCredentials.mockReturnValueOnce({
            ...expectedTokenAnswer,
            expiresAt: new Date()
        });

        const paxfulApi = usePaxful(credentials, credentialStorage);

        const profile = await paxfulApi.getProfile();

        expect(profile).toMatchObject(userProfile);
    });

    it('I can get my trades', async function () {
        process.env.PAXFUL_DATA_HOST = "";
        const credentialStorage = mock<CredentialStorage>();
        credentialStorage.getCredentials.mockReturnValueOnce({
            ...expectedTokenAnswer,
            expiresAt: new Date()
        });

        const expectedTrades = [];

        (fetch as unknown as FetchMockSandbox).once({
            url: /https:\/\/paxful.com\/data\/trades/,
            method: "POST"
        }, {
            status: 200,
            body: JSON.stringify(expectedTrades)
        }, {
            sendAsJson: false
        });

        const paxfulApi = usePaxful(credentials, credentialStorage);

        const trades = await paxfulApi.invoke('/data/trades');

        expect(trades).toMatchObject(expectedTrades);
    });

    it('I dont need to worry about refreshing my credentials', async function () {
        const userProfile = {
            sub: UUID(),
            nickname: UUID(),
            given_name: UUID(),
            family_name: UUID(),
            locale: "en",
            picture: "https://paxful.com/2/images/avatar.png",
            email: `${UUID()}@paxful.test.com`,
            email_verified: true
        };

        (fetch as unknown as FetchMockSandbox).once({
            name: 'invalid_access_token',
            url: /oauth2\/userinfo/,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${expectedTokenAnswer.accessToken}`
            }
        }, {
            status: 401,
            body: ""
        }, {
            sendAsJson: false
        }).once({
            name: 'correct_access_token',
            url: /oauth2\/userinfo/,
            method: "GET"
        }, {
            status: 200,
            body: JSON.stringify(userProfile)
        }, {
            sendAsJson: false
        });

        const credentialStorage = mock<CredentialStorage>();
        credentialStorage.getCredentials.mockReturnValue({
            ...expectedTokenAnswer,
            expiresAt: new Date()
        });

        const paxfulApi = usePaxful(credentials, credentialStorage);

        const profile = await paxfulApi.getProfile();

        expect(profile).toMatchObject(userProfile);
    });
});
