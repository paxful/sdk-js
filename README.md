# Paxful SDK

[![Paxful Javascript SDK](https://github.com/paxful/sdk-js/actions/workflows/github-actions-paxful.yml/badge.svg)](https://github.com/paxful/sdk-js/actions/workflows/github-actions-paxful.yml)

This SDK is to be used to simplify creation of software that consumes APIs provided by Paxful.

It can be used with Javascript and Typescript projects or any other language that is **transpiled to Javascript**.

## Features
* Takes care of intricacies of OAuth2 protocol implementation - just instantiate the library and use the high level API
* Automatic keys rotation and persistence
* Error handling
* Fluent API (coming soon)
* `Client Credentials` and `Authorization Code Grant` flows support (read below)

## Installation

To install SDK to your NPM project you need to run the following command:

 ```bash
 npm i @paxful/sdk-js
 ```

## Getting Started

The very first thing you need to do is to create an application and get your `Client ID` (`App ID` on developers portal) 
and `Secret`. You can do that by creating an application [here](https://developers.paxful.com/apps/new/?src=gh-sdk-js). 
Once you have created an application, do not forget to add at least one product to it, you can do that under `Products`.
If you would like to follow along with this guide, then once you have created an application go ahead and add 
`Paxful API` to it.

## Supported Flows

`Client Credentials` flow you may want to use when you are the owner of the account that you're going to be accessing 
using the APIs. The `Authorization Code Grant` flow is to be used when you would like to gain access to another user's 
account and start performing some operations upon it on behalf of the user.

If you are just staring with the SDK and want to play around, we suggest you going with `Client Credentials` flow. 
Switching later to `Authorization Code Flow` will require minimum updates to the existing code base - you will just need 
to implement a thin persistence layer (as explained below), and a couple of controllers which are used for redirects.

### Client Credentials Flow
 
This is how you can get started with `Client Credentials` flow: 
```typescript
import usePaxful from "@paxful/sdk-js";

const paxfulApi = usePaxful({
    clientId: "YOUR CLIENT ID HERE",
    clientSecret: "YOUR CLIENT SECRET HERE"
});
```

After you have instantiated an instance you can use its `invoke` method:
```typescript
const myOffers = await paxfulApi.invoke("/paxful/v1/offer/all", { type: 'sell' });
```

**NB!** For client-credentials flow we recommend implementing a credentials storage and configuring SDK to use it. 
For more details, please see `Persistence` section below.

### Authorization Code Grant Flow

To use authorization flow beside `clientId` and `clientSecret` you also need to specify `redirectUri`, this is 
where a user would be returned once he has granted/or not the access you have requested (`scopes`). 
 ```typescript
import usePaxful from "@paxful/sdk-js";

const paxfulApi = usePaxful({
    clientId: "YOUR CLIENT ID HERE",
    clientSecret: "YOUR CLIENT SECRET HERE",
    redirectUri: "YOUR REDIRECT URI HERE",
    //  scope: ["profile", "email"] // Optional variable for passing requested scopes.
});
```
(a list of all available scopes for Paxful API can be found [here](https://developers.paxful.com/paxful-products/paxful/documentation/?src=gh-sdk-js))
 
The SDK is framework agnostic and only relies on a generic `Http2ServerResponse` for working with the web layer. 
The method that would initiate authentication flow may look as simple as this:

```javascript
function login(response) {
    paxfulApi.login(response);
}
```

Controller that you would specify for `redirectUri` could look akin to the following:

```javascript
async function callback(request, response) {
    await paxfulApi.impersonatedCredentials(request.query.code);
}
```

`impersonatedCredentials` method would do all the necessary OAuth2 machinery for you in order to receive an access token. 
Once the `impersonatedCredentials` operation method has been invoked, you can start using `invoke` method to access 
endpoints on behalf of a user in the same way as in `Client Credentials` flow:
```typescript
const myOffers = await paxfulApi.invoke("/paxful/v1/offer/all", { type: 'sell' });
```

**NB!** For authorization code grant flow, for production usage, you need to implement a credentials storage and 
configure SDK to use it. For more details, please see `Persistence` section below.

### SDK methods

For working with `Paxful API` you'd need to use `invoke` method. `Paxful API` follows RPC standard and `invoke` takes 
care for you of handling specific of this protocol:
* `PaxfulAPI.invoke(url: string, payload?: InvokeBody): AnyPromise`

If you would like to use SDK for working with new APIs (like `Webhooks API` that is soon to be released), you
should use on the following methods:
* `PaxfulApi.get(url: string, params: InvokeBody = {}): AnyPromise`
* `PaxfulApi.post(url: string, json?: AnyJson): AnyPromise`
* `PaxfulApi.put(url: string, json?: AnyJson): AnyPromise`
* `PaxfulApi.delete(url: string, json?: AnyJson): AnyPromise`
* `PaxfulApi.upload(url: string, payload: InvokeBody, method="POST"): AnyPromise`
* `PaxfulApi.download(url: string, payload: InvokeBody = {}, method="GET"): AnyPromise`

### Persistence

When you create an instance of SDK, in both flows, SDK will automatically create an in-memory storage for storing 
credentials. When you are working with `Client Credentials` flow, that may not be much of an issue - if you
stop a NodeJS application, then upon next start SDK will automatically fetch access token required for you account when
you are making a first request, hence only additional latency added to first request. Situation changes when you're 
using `Authorization Code Grant` - in this case you will lose access token that you have received when users 
authorized your application and users will need to pass authentication flow again. In order to avoid that you may 
implement `CredentialStorage` that would keep credentials in a storage of your liking (some kind of database) and 
therefore fetched credentials would survive NodeJs application restarts. Given that every schema and application 
requirements are different we are not shipping any implementation of `CredentialsStorage` out of the box beside 
[in-memory one](src/oauth/CredentialStorage.ts#L9). The interface is very simple and contains only two methods - 
`getCredentials` and `saveCredentials` thus implementing a proper storage for your application should take no time. 

Once you have implemented the interface, you may pass its instance as a second argument to `usePaxful` helper method,
for example:

```typescript
const redisCredentialsStorage = new MyFancyRedisCredentialsStorage();
const paxfulApi = usePaxful({
    clientId: "YOUR CLIENT ID HERE",
    clientSecret: "YOUR CLIENT SECRET HERE",
    redirectUri: "YOUR REDIRECT URI HERE",
    //  scope: ["profile", "email"] // Optional variable for passing requested scopes.
}, redisCredentialsStorage);
```

#### Proxy

SDK also provides a support for using proxy servers to forward API requests. If you would like to enable it
then you need to do two things:
* install [simple-proxy-agent](https://www.npmjs.com/package/simple-proxy-agent) library to your project
* use `proxyAgent` configuration parameter when creating an instance of SDK to pass ProxyAgent object.

You can install `simple-proxy-agent` library to your project by running:

```bash
npm install simple-proxy-agent
```

And here's a snippet of code showing how you could enable proxy support for SDK:

```typescript
import ProxyAgent from "simple-proxy-agent";

const paxfulApi = usePaxful({
    clientId: "YOUR CLIENT ID HERE",
    clientSecret: "YOUR CLIENT SECRET HERE",
    redirectUri: "YOUR REDIRECT URI HERE",
    //  scope: ["profile", "email"] // Optional variable for passing requested scopes.
    proxyAgent: new ProxyAgent("YOUR PROXY URL HERE")
});
```

Both `Client Credentials` and `Authorization Code Grant` flows support working with proxy.

## Contributing
### Pre-requisites

* Node JS (preferable installed by NVM) v12+

### Tests

To run the tests execute the following command:
```shell
npm run lint
npm test
```

Please follow TDD to develop at this project. This means that you need to follow this steps:

* Create the test for the feature
* Make the test pass
* Refactor without breaking the tests

Keep in mind that every new feature, bugfix or hotfix needs to follow this rule.

### Documentation

To generate the documentation, execute the following command:
```shell
npm run doc
```

The documentation will be generated at `public/` folder.

## License

```markdown
Copyright (C) (2021) Paxful Inc.

All rights reserved - Do Not Redistribute
```
