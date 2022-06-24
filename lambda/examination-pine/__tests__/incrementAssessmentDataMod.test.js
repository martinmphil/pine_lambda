const { incrementAssessmentData } = require("../incrementAssessmentDataMod");
const { awsSdkPromiseResponse } = require("aws-sdk");
jest.mock("aws-sdk");

describe("incrementAssessmentData", () => {
  it("exists", () => {
    expect.assertions(1);
    expect(incrementAssessmentData).toBeDefined();
  });
  it("returs update db attributes", () => {
    expect.assertions(1);
    awsSdkPromiseResponse.mockReturnValueOnce(
      Promise.resolve({
        Attributes: {
          qIndex: 1,
          updatedAt: "2022-01-01...",
        },
      })
    );
    incrementAssessmentData("can#abc", "exam#123", 1).then((r) => {
      expect(r).toHaveProperty("Attributes");
    });
  });
});
