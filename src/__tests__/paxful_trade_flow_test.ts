import usePaxful from "../index";
import { createReadStream, existsSync } from "fs";
import { resolve } from "path";

type Trade = {
  trade_hash: string;
};

jest.setTimeout(60000);

const paxfulApiSeller = usePaxful({
  clientId: `${process.env.SELLER_CLIENT_ID}`,
  clientSecret: `${process.env.SELLER_CLIENT_SECRET}`,
});

const paxfulApiBuyer = usePaxful({
  clientId: `${process.env.BUYER_CLIENT_ID}`,
  clientSecret: `${process.env.BUYER_CLIENT_SECRET}`,
});

describe("trade flow", () => {
  let offer_hash: string;
  let trade_hash: string;
  let image_hash: string;
  const imagePath = "./src/__tests__/paxful.png";
  const textMessage = "just test message";
  const offerData = {
    margin: 0,
    currency: "USD",
    range_max: 100,
    range_min: 10,
    offer_terms: "I want to sell bitcoin",
    trade_details: "nothing add here",
    payment_window: 60,
    offer_type_field: "sell",
    vendor_terms_required: false,
    payment_method_id: 1,
    payment_method: "1",
  };

  it("Get all 'sell' offers", async () => {
    const response = await paxfulApiSeller.invoke("/paxful/v1/offer/all", {
      type: "sell",
    });
    expect(response.status).toBe("success");
    expect(response.data.totalCount).toBeDefined();
  });

  it("Remove all old trades", async () => {
    const response = await paxfulApiSeller.invoke("/paxful/v1/trade/list");
    response.data.count &&
    response.data.trades.map((trade: Trade) =>
      paxfulApiSeller.invoke("/paxful/v1/trade/cancel", {
        trade_hash: trade.trade_hash,
      })
    );
    expect(response.status).toBe("success");
  });

  it("Create an offer", async () => {
    const response = await paxfulApiSeller.invoke("/paxful/v1/offer/create", offerData);
    offer_hash = response.data.offer_hash;
    expect(offer_hash).toBeDefined();
  });

  it("Get offer", async () => {
    const response = await paxfulApiBuyer.invoke("/paxful/v1/offer/get", {
      offer_hash: offer_hash,
    });
    expect(response.data.offer_hash).toBeDefined();
  });

  it("Start trade", async () => {
    const response = await paxfulApiBuyer.invoke("/paxful/v1/trade/start", {
      offer_hash: offer_hash,
      fiat: 25,
    });
    trade_hash = response.data.trade_hash;
    expect(trade_hash).toBeDefined();
  });

  it("Send message", async () => {
    const response = await paxfulApiBuyer.invoke("/paxful/v1/trade-chat/post", {
      trade_hash: trade_hash,
      message: textMessage,
    });
    expect(response.status).toBe("success");
  });

  it("Read message", async () => {
    const response = await paxfulApiSeller.invoke("/paxful/v1/trade-chat/get", {
      trade_hash: trade_hash,
    });
    expect(response.status).toBe("success");
  });

  it("Send image", async () => {
    if (!existsSync(imagePath)) {
      return `file '${imagePath}' not found`;
    }
    const image = createReadStream(resolve(__dirname, imagePath));
    const uploadPayload = {
      trade_hash: trade_hash,
      file: image,
    };

    const response = await paxfulApiSeller.invoke(
      "/paxful/v1/trade-chat/image/upload",
      uploadPayload
    );
    image_hash = response.data.image_hash;

    expect(image_hash).toBeDefined();
  });

  it("donwload image", async () => {
    // temporary unawailable
    const response = await paxfulApiBuyer.invoke("/paxful/v1/trade-chat/image", {
      image_hash,
      size: "3",
    });
  });

  it("Pay trade", async () => {
    const response = await paxfulApiBuyer.invoke("/paxful/v1/trade/paid", {
      trade_hash: trade_hash,
    });
    expect(response.status).toBe("success");
  });

  it("Release bitcoin", async () => {
    const response = await paxfulApiSeller.invoke("/paxful/v1/trade/release", {
      trade_hash: trade_hash,
    });
    expect(response.status).toBe("success");
  });

  it("Check wallet balance", async () => {
    const response = await paxfulApiSeller.invoke("/paxful/v1/wallet/balance", {
      crypto_currency_code: "BTC",
    });
    expect(response.status).toBe("success");
    expect(parseInt(response.data.balance)).toBeGreaterThan(0);
  });

  it("Deactivate offer", async () => {
    const response = await paxfulApiSeller.invoke("/paxful/v1/offer/deactivate", {
      offer_hash,
    });
    expect(response.status).toBe("success");
  });
});
