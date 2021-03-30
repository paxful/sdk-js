import dotenv from "dotenv";
import fetchMock from "fetch-mock";

dotenv.config();
process.env.PAXFUL_OAUTH_HOST = "https://test.local";
process.env.PAXFUL_DATA_HOST = "https://test.local";

jest.mock('node-fetch', () => fetchMock.sandbox())
