import dotenv from "dotenv";
import fetchMock from "fetch-mock";

dotenv.config();

jest.mock('node-fetch', () => fetchMock.sandbox())
