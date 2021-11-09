import fetch from "node-fetch";
import usePaxful from "../";
import { FetchMockSandbox } from "fetch-mock";


describe("With the Paxful API SDK", function () {
    it('I can see my offers in client grant flow', async function (){
        (fetch as unknown as FetchMockSandbox).reset();
        const credentials = {
            clientId: process.env.PAXFUL_CLIENT_ID || "",
            clientSecret: process.env.PAXFUL_CLIENT_SECRET || "",
        };
        const paxfulApi = usePaxful(credentials);
        const offers = await paxfulApi.invoke('/paxful/v1/offer/all', {
            offer_type: "buy"
        });
        expect(offers.status).toEqual("success");
        expect(offers?.data?.offers.length).toBeGreaterThan(0);
    });

});
