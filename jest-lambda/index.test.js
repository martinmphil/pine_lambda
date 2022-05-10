const { handler } = require("./index");

jest.mock("aws-sdk");

describe("handler fn", () => {
  it("exists", async () => {
    expect.assertions(1);
    expect(handler()).toBeDefined();
  });

  it("resolves with body property", async () => {
    expect.assertions(1);
    await expect(handler()).resolves.toHaveProperty("body");
  });

  it("returns string: oh", async () => {
    expect.assertions(1);
    const response = await handler();
    expect(response.body).toMatch(/oh/i);
  });
});
