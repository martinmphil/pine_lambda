const { awsSdkPromiseResponse } = require("aws-sdk");
const getDbItemMod = require("../getDbItemMod");
const getDbItem = getDbItemMod.getDbItem;

jest.mock("aws-sdk");

describe("get db Item fn", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("exists", async () => {
    expect.assertions(2);
    expect(getDbItem).toBeDefined();

    awsSdkPromiseResponse.mockReturnValueOnce(Promise.resolve({ Item: true }));
    const gottenItem = await getDbItem();
    expect(gottenItem).toBe(true);
  });
});
