import usePaxful from "../index";

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
  // let image_hash: string;
  // const imagePath = "./src/__tests__/paxful.png";
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

  it("gets all 'sell' offers", async () => {
    const response = await paxfulApiSeller.invoke("/paxful/v1/offer/all", {
      type: "sell",
    });
    expect(response.status).toBe("success");
    expect(response.data.totalCount).toBeDefined();
  });

  it("remove all old trades", async () => {
    const response = await paxfulApiSeller.invoke("/paxful/v1/trade/list");
    response.data.count &&
    response.data.trades.map((trade: Trade) =>
      paxfulApiSeller.invoke("/paxful/v1/trade/cancel", {
        trade_hash: trade.trade_hash,
      })
    );
    expect(response.status).toBe("success");
  });

  it("create offer", async () => {
    const response = await paxfulApiSeller.invoke("/paxful/v1/offer/create", offerData);
    offer_hash = response.data.offer_hash;
    expect(offer_hash).toBeDefined();
  });

  it("get offer", async () => {
    const response = await paxfulApiBuyer.invoke("/paxful/v1/offer/get", {
      offer_hash: offer_hash,
    });
    expect(response.data.offer_hash).toBeDefined();
  });

  it("start trade", async () => {
    const response = await paxfulApiBuyer.invoke("/paxful/v1/trade/start", {
      offer_hash: offer_hash,
      fiat: 25,
    });
    trade_hash = response.data.trade_hash;
    expect(trade_hash).toBeDefined();
  });

  it("send message", async () => {
    const response = await paxfulApiBuyer.invoke("/paxful/v1/trade-chat/post", {
      trade_hash: trade_hash,
      message: textMessage,
    });
    expect(response.status).toBe("success");
  });

  it("read message", async () => {
    const response = await paxfulApiSeller.invoke("/paxful/v1/trade-chat/get", {
      trade_hash: trade_hash,
    });
    expect(response.status).toBe("success");
  });

  // it("send image", async () => {
  //   console.log(`sending image ${imagePath} to trade: ${trade_hash}`);
  //   if (!existsSync(imagePath)) {
  //     console.log("file not found:", imagePath);
  //     return `file '${imagePath}' not found`;
  //   }
  //   console.log("file found:", imagePath);
  //   const image = createReadStream(resolve(__dirname, imagePath));
  //   const uploadPayload = {
  //     trade_hash: trade_hash,
  //     file: image,
  //   };
  //   console.log("containsBinary", containsBinary(uploadPayload));
  //   const response = await paxfulApiSeller.invoke(
  //     "/paxful/v1/trade-chat/image/upload",
  //     uploadPayload
  //   );
  //   image_hash = response.data.image_hash;
  //   console.log("updaload file:", response);
  //   expect(image_hash).toBeDefined();
  // });
  //
  // it("donwload image", async () => {
  //   console.log("loading image from chat");
  //   // temporary unawailable
  //   const response = await paxfulApiBuyer.invoke("/paxful/v1/trade-chat/image", {
  //     image_hash,
  //     size: "3",
  //   });
  //   console.log("image loaded:", response.data);
  // });

  it("paid trade", async () => {
    const response = await paxfulApiBuyer.invoke("/paxful/v1/trade/paid", {
      trade_hash: trade_hash,
    });
    expect(response.status).toBe("success");
  });

  it("release bitcoin", async () => {
    const response = await paxfulApiSeller.invoke("/paxful/v1/trade/release", {
      trade_hash: trade_hash,
    });
    expect(response.status).toBe("success");
  });

  it("check wallet", async () => {
    const response = await paxfulApiSeller.invoke("/paxful/v1/wallet/balance", {
      crypto_currency_code: "BTC",
    });
    expect(response.status).toBe("success");
    expect(response.data.balance).toBeGreaterThan(0);
  });

  it("deactivateOffer", async () => {
    const response = await paxfulApiSeller.invoke("/paxful/v1/offer/deactivate", {
      offer_hash,
    });
    expect(response.status).toBe("success");
  });
});
