import { RequestBuilder } from "../commands/Invoke";
import { Response } from "node-fetch";
import { Credentials } from "../oauth";
import { mock } from "jest-mock-extended";
import { ApiConfiguration } from "../ApiConfiguration";
import ProxyAgent from "simple-proxy-agent";

const exampleJson = '{"some": "json"}';

describe("With the Request Builder", function () {

    it('I can build basic request', async function () {
        const builder: RequestBuilder = new RequestBuilder("some-url");
        const [request, transform] = builder.build()
        expect(request.url).toEqual("some-url")
        expect(request.method).toEqual("GET")
        expect(request.headers).toMatchObject({})
        expect(request.body).toBe(null)

        const response = new Response(exampleJson);
        expect(await transform(response)).toBe(response)
    });

    it('I can send json', async function () {
        const builder: RequestBuilder = new RequestBuilder("some-url");

        builder
            .withMethod("POST")
            .withJsonData({ some: "data" })

        const [request, transform] = builder.build()
        // eslint-disable-next-line radar/no-duplicate-string
        expect(request.headers.get("Content-Type")).toEqual("application/json")
        expect(request.body).toEqual(Buffer.from('{"some":"data"}'))

        const response = new Response(exampleJson);
        expect(await transform(response)).toBe(response)
    });

    it('I can send form', async function () {
        const builder: RequestBuilder = new RequestBuilder("some-url");

        builder
            .withMethod("POST")
            .withFormData({ some: "data" })

        const [request, transform] = builder.build()
        expect(request.headers.get("Content-Type")).toEqual("application/x-www-form-urlencoded")
        expect(request.body).toEqual(Buffer.from('some=data'))

        const response = new Response(exampleJson);
        expect(await transform(response)).toBe(response)
    });

    it('I can send multipart form', async function () {
        const builder: RequestBuilder = new RequestBuilder("some-url");

        builder
            .withMethod("POST")
            .withMultipartFormData({ some: "data", file1: Buffer.from("123") })

        const [request] = builder.build()
        expect(request.headers.get("Content-Type")).toMatch("multipart/form-data")
        expect(request.body.constructor.name).toEqual("FormData")
    });

    it('I can receive json', async function () {
        const builder: RequestBuilder = new RequestBuilder("some-url");

        builder.acceptJson()

        const [request, transform] = builder.build()
        expect(request.headers.get("Accept")).toEqual("application/json")
        expect(request.body).toBe(null)

        const response = new Response(exampleJson);
        expect(await transform(response)).toMatchObject({ "some": "json" })
    });

    it('I can receive text', async function () {
        const builder: RequestBuilder = new RequestBuilder("some-url");

        builder.acceptText()

        const [request, transform] = builder.build()
        expect(request.body).toBe(null)

        const response = new Response(exampleJson);
        expect(await transform(response)).toEqual(exampleJson)
    });

    it('I can receive binary content', async function () {
        const builder: RequestBuilder = new RequestBuilder("some-url");

        builder.acceptBinary()

        const [request, transform] = builder.build()
        expect(request.body).toBe(null)

        const response = new Response(Buffer.from(exampleJson));
        const actual = await transform(response);
        expect(actual.constructor.name).toEqual("Buffer")
    });

    it.each`
        method
        ${'GET'}
        ${'POST'}
        ${'PATCH'}
        ${'DELETE'}
        ${'OPTIONS'}
  `('I can send "$method"', async function ({ method }) {
        const builder: RequestBuilder = new RequestBuilder("some-url");

        builder.withMethod(method)

        const [request] = builder.build()
        expect(request.method).toEqual(method)
    });

    it('I can set custom headers', async function () {
        const builder: RequestBuilder = new RequestBuilder("some-url");

        builder
            .withHeader("foo", "123")
            .withHeader("bar", "321")

        const [request] = builder.build()
        expect(request.headers.get("foo")).toEqual("123")
        expect(request.headers.get("bar")).toEqual("321")
    });

    it('I can send authorized request', async function () {
        const builder: RequestBuilder = new RequestBuilder("some-url");

        const credentials: Credentials = { accessToken: "foo", refreshToken: "bar", expiresAt: new Date() }

        builder.withAuthorization(credentials)

        const [request] = builder.build()
        expect(request.headers.get("Authorization")).toEqual("Bearer foo")
    });

    it('I can use proxy', async function () {
        const builder: RequestBuilder = new RequestBuilder("some-url");

        const proxy = mock(ProxyAgent)
        const config: ApiConfiguration = { clientId: "foo", clientSecret: "bar", proxyAgent: proxy }

        builder.withConfig(config)

        const [request] = builder.build()
        expect(request.agent).toBe(proxy)
    });
});
