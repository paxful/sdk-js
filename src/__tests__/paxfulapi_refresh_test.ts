import 'fetch-mock-jest';
import usePaxful from "../index";
import { mock } from "jest-mock-extended";
import { CredentialStorage } from "../oauth";
import { v4 as UUID } from "uuid";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetchMock = require('node-fetch')

jest.mock(
    'node-fetch',
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    () => require('fetch-mock-jest').sandbox(),
);


const credentials = {
    clientId: UUID(),
    clientSecret: UUID(),
    redirectUri: "callback"
};
let credentialStorage = mock<CredentialStorage>();

describe("With the Paxful API SDK", function () {
    afterEach(() => {
        fetchMock.reset();
        credentialStorage = mock<CredentialStorage>();
    });

    const GET_PROFILE_URL = "/oauth2/userinfo/";

    it("Client credentials reset flow. Get profile", async () => {
        const initialAccessToken = UUID();

        fetchMock.once({
            url: /oauth2\/userinfo/,
            method: "GET",
            headers: {
                Authorization: 'Bearer ' + initialAccessToken
            }
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
            method: "GET",
            headers: {
                Authorization: 'Bearer abc'
            }
        }, {
            status: 200,
            body: JSON.stringify({ some: "lala" })
        });


        credentialStorage.getCredentials.mockReturnValue({
            ...{
                accessToken: initialAccessToken,
                refreshToken: UUID(),
            },
            expiresAt: new Date()
        });

        const paxfulApi = usePaxful(credentials, credentialStorage);
        const profile = await paxfulApi.get(GET_PROFILE_URL);

        expect(profile).toMatchObject({ some: "lala" });
        expect(fetchMock).toHaveFetchedTimes(3);
        expect(credentialStorage.saveCredentials).toBeCalledWith({
            accessToken: "abc",
            refreshToken: null,
            expiresAt: expect.anything()
        })
    });

    it("Client credentials are not saved if refresh response code is wrong", async () => {
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
            status: 422,
            body: JSON.stringify({
                access_token: "abc",
                refresh_token: null,
                expires_in: 100
            })
        });

        const paxfulApi = usePaxful(credentials, credentialStorage);
        await expect(paxfulApi.get(GET_PROFILE_URL)).rejects.toThrowError();

        expect(credentialStorage.saveCredentials).not.toBeCalled();
    });


    it("Client credentials are not saved if refresh response is wrong", async () => {
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
                whatever: "lala"
            })
        });

        const paxfulApi = usePaxful(credentials, credentialStorage);

        await expect(paxfulApi.get(GET_PROFILE_URL)).rejects.toThrowError();

        expect(credentialStorage.saveCredentials).not.toBeCalled();
    });


    it.each([
        ["invoke", "POST"],
        ["get", "GET"],
        ["post", "POST"],
        ["put", "PUT"],
        ["patch", "PATCH"],
        ["delete", "DELETE"],
    ])('Client credentials reset flow. %s - %s', async (fn, expectedMethod) => {
        fetchMock.once({
            name: "try1__bad-token",
            url: /some\/url/,
            method: expectedMethod
        }, {
            status: 401,
            body: ""
        });

        fetchMock.once({
            url: /oauth2\/token/,
            method: "POST"
        }, {
            status: 200,
            body: JSON.stringify({
                access_token: "abc",
                refresh_token: null,
                expires_in: 100
            })
        });

        fetchMock.once({
            name: "try2__good-token",
            url: /some\/url/,
            method: expectedMethod
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
        const profile = await paxfulApi[fn]("/some/url");

        expect(profile).toMatchObject({ some: "lala" });
        expect(fetchMock).toHaveFetchedTimes(3);
        expect(credentialStorage.saveCredentials).toBeCalledWith({
            accessToken: "abc",
            refreshToken: null,
            expiresAt: expect.anything()
        })
    })

    it("CC wrong response: Client credentials are not saved if refresh response is wrong", async () => {
        fetchMock.once({
            name: 'correct_access_token',
            url: /oauth2\/token/,
            method: "POST"
        }, {
            status: 200,
            body: JSON.stringify({
                whatever: "lala"
            })
        });

        const paxfulApi = usePaxful(credentials, credentialStorage);

        await expect(paxfulApi.myCredentials()).rejects.toThrowError();

        expect(credentialStorage.saveCredentials).not.toBeCalled();
    });

    it("CC wrong status: Client credentials are not saved if refresh response is wrong", async () => {
        fetchMock.once({
            name: 'correct_access_token',
            url: /oauth2\/token/,
            method: "POST"
        }, {
            status: 422,
            body: JSON.stringify({
                access_token: "abc",
                refresh_token: null,
                expires_in: 100
            })
        });

        const paxfulApi = usePaxful(credentials, credentialStorage);

        await expect(paxfulApi.myCredentials()).rejects.toThrowError();

        expect(credentialStorage.saveCredentials).not.toBeCalled();
    });



    it("AC refresh: Client credentials are not saved if refresh response code is wrong", async () => {

        credentialStorage.getCredentials.mockReturnValue({
            accessToken: "cda",
            refreshToken: "abc",
            expiresAt: new Date()
        });

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
            status: 422,
            body: JSON.stringify({
                access_token: "abc",
                refresh_token: "cda",
                expires_in: 100
            })
        });

        const paxfulApi = usePaxful(credentials, credentialStorage);
        await expect(paxfulApi.get(GET_PROFILE_URL)).rejects.toThrowError();

        expect(credentialStorage.saveCredentials).not.toBeCalled();
    });


    it("AC refresh: manual refresh", async () => {
        credentialStorage.getCredentials.mockReturnValue({
            accessToken: "cda",
            refreshToken: "abc",
            expiresAt: new Date()
        });

        fetchMock.once({
            name: 'correct_access_token',
            url: /oauth2\/token/,
            method: "POST"
        }, {
            status: 200,
            body: JSON.stringify({
                access_token: "eee",
                refresh_token: "fff",
                expires_in: 100
            })
        });

        const paxfulApi = usePaxful(credentials, credentialStorage);
        const creds = await paxfulApi.refreshCredentials();
        expect(creds.accessToken).toEqual("eee");
        expect(creds.refreshToken).toEqual("fff");

        expect(credentialStorage.saveCredentials)

        expect(credentialStorage.saveCredentials).toBeCalled();
    });

    it("CC refresh: manual refresh", async () => {
        credentialStorage.getCredentials.mockReturnValue({
            accessToken: "cda",
            refreshToken: "",
            expiresAt: new Date()
        });

        fetchMock.once({
            name: 'correct_access_token',
            url: /oauth2\/token/,
            method: "POST"
        }, {
            status: 200,
            body: JSON.stringify({
                access_token: "eee",
                refresh_token: "",
                expires_in: 100
            })
        });

        const paxfulApi = usePaxful(credentials, credentialStorage);
        const creds = await paxfulApi.refreshCredentials();
        expect(creds.accessToken).toEqual("eee");
        expect(creds.refreshToken).toEqual("");

        expect(credentialStorage.saveCredentials).toBeCalled();
    });


    it("AC refresh: Client credentials are not saved if refresh response is wrong", async () => {

        credentialStorage.getCredentials.mockReturnValue({
            accessToken: "cda",
            refreshToken: "abc",
            expiresAt: new Date()
        });

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
                some: "alal"
            })
        });

        const paxfulApi = usePaxful(credentials, credentialStorage);
        await expect(paxfulApi.get(GET_PROFILE_URL)).rejects.toThrowError();

        expect(credentialStorage.saveCredentials).not.toBeCalled();
    });


});
