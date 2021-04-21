# Paxful API SDK

[![Paxful Javascript SDK](https://github.com/paxful/sdk-js/actions/workflows/github-actions-paxful.yml/badge.svg)](https://github.com/paxful/sdk-js/actions/workflows/github-actions-paxful.yml)

This project helps developers to implement integration
with Paxful more easily.

It can be used with Javascript and Typescript projects or any other
language that is **transpiled to Javascript**.

## Use
To use authorization flow use:
 ```typescript
 import usePaxful from "@paxful/sdk-js";

 const paxfulApi = usePaxful({
     clientId: "YOUR CLIENT ID HERE",
     clientSecret: "YOUR CLIENT SECRET HERE",
     redirectUri: "YOUR REDIRECT URI HERE",
 //  scope: ["profile", "email"] // Optional variable for passing requested scopes.
 });
 ```

 To use client credentials flow use:
 ```typescript
 import usePaxful from "@paxful/sdk-js";

 const paxfulApi = usePaxful({
     clientId: "YOUR CLIENT ID HERE",
     clientSecret: "YOUR CLIENT SECRET HERE",
 //  scope: ["profile", "email"] // Optional variable for passing requested scopes.
 });
 ```

## Build
### Pre-requisites

* Node JS (preferable installed by NVM) v12+

### Tests

To run the tests execute the following command:
```shell
npm run lint
npm test
```

Please follow TDD to develop at this project. This means that you
need to follow this steps:

* Create the test for the feature
* Make the test pass
* Refactor without breaking the tests

Keep in mind that every new feature, bugfix or hotfix needs to
follow this rule.

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
