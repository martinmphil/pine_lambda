const { getAssessmentData } = require("../getAssessmentDataMod");
const { awsSdkPromiseResponse } = require("aws-sdk");

describe("getAssessmentData fn", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("exists", () => {
    expect.assertions(1);
    expect(getAssessmentData).toBeDefined();
  });
  it("returns a db Item", async () => {
    expect.assertions(1);
    awsSdkPromiseResponse.mockReturnValueOnce(
      Promise.resolve({ Item: "dummy_data" })
    );
    const gottenItem = await getAssessmentData("can#1", "exam#1");
    expect(gottenItem).toBe("dummy_data");
  });
});
