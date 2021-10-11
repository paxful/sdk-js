import fetch from 'node-fetch';

// We need this import to get the extra jest assertions

import 'fetch-mock-jest';
import usePaxful from "../index";
import { mock } from "jest-mock-extended";
import { CredentialStorage } from "../oauth";
import { v4 as UUID } from "uuid";

const fetchMock = require('node-fetch')

jest.mock(
    'node-fetch',
    () => require('fetch-mock-jest').sandbox(),
);


const credentials = {
    clientId: UUID(),
    clientSecret: UUID(),
    redirectUri: "callback"
};
const credentialStorage = mock<CredentialStorage>();

describe("With the Paxful API SDK", function () {
    beforeEach(() => fetchMock.reset());

    // it('I can get a impersonated access token and refresh token', async function () {
    //     const paxfulApi = usePaxful(credentials);
    //
    //     const response = await paxfulApi.impersonatedCredentials(UUID());
    //
    //     expect(response).toMatchObject(expectedTokenAnswer);
    // });


    it("Client credentials reset flow", async () => {
        fetchMock.once({
            url: /oauth2\/userinfo/,
            method: "GET"
        }, {
            status: 401,
            body: ""
        });

        fetchMock.once({
            name: 'correct_access_token',
            url: /oauth2\/token/,
            method: "POST"
        }, {
            status: 200,
            body: JSON.stringify({
                access_token: "abc",
                refresh_token: null,
                expires_in: 100
            })
        }, {
            sendAsJson: false
        });

        fetchMock.once({
            name: 'correct_access_token',
            url: /oauth2\/userinfo/,
            method: "GET"
        }, {
            status: 200,
            body: JSON.stringify({ some: "lala" })
        });

        credentialStorage.getCredentials.mockReturnValue({
            ...{
                accessToken: UUID(),
                refreshToken: UUID(),
            },
            expiresAt: new Date()
        });

        const paxfulApi = usePaxful(credentials, credentialStorage);
        const profile = await paxfulApi.getProfile();

        expect(profile).toMatchObject({ some: "lala" });
        expect(fetchMock).toBeCalledTimes(3);
        expect(credentialStorage.saveCredentials).toBeCalledWith({
                accessToken: "abc",
                refreshToken: null,
                expiresAt: expect.anything()
            })
    });
});
