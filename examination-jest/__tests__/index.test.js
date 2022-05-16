const { handler } = require("../index");

const dummyEvent = "dummyEvent";

describe("handler fn", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("exists", async () => {
    expect.assertions(1);
    expect(handler(dummyEvent)).toBeDefined();
  });

  it("resolves with body property", async () => {
    expect.assertions(1);
    await expect(handler(dummyEvent)).resolves.toHaveProperty("body");
  });
});
