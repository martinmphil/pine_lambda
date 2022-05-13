const { handler } = require("./index");

jest.mock("aws-sdk");

const dummyEvent = "dummyEvent";

describe("handler fn", () => {
  it("exists", async () => {
    expect.assertions(1);
    expect(handler(dummyEvent)).toBeDefined();
  });

  it("resolves with body property", async () => {
    expect.assertions(1);
    await expect(handler(dummyEvent)).resolves.toHaveProperty("body");
  });
});
