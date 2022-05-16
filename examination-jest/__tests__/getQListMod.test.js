const { getQList } = require("../getQListMod");
const { awsSdkPromiseResponse } = require("aws-sdk");

describe("getQList fn", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("exists", () => {
    expect.assertions(1);
    expect(getQList).toBeDefined();
  });
  it("returns an array", async () => {
    expect.assertions(1);
    awsSdkPromiseResponse.mockReturnValueOnce(
      Promise.resolve({ Item: { qList: ["dummyStr1", "dummyStr2"] } })
    );
    const gottenItem = await getQList("examId", "examId");
    expect(gottenItem[1]).toBe("dummyStr2");
  });
});
