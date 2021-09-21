import dotenv from "dotenv";

dotenv.config();

jest.mock('node-fetch', () => {
    const nodeFetch = jest.requireActual('node-fetch');
    // eslint-disable-next-line
    const sandbox = require('fetch-mock').sandbox();
    Object.assign(sandbox.config, {
        fetch: nodeFetch,
        fallbackToNetwork: true,
        warnOnFallback: false
    });
    return sandbox;
});
