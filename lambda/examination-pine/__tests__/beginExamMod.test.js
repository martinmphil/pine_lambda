const { beginExam } = require("../beginExamMod");
const { dummyAssessmentData } = require("../__mocks__/dummyAssessmentData");
jest.mock("../getQListMod");
const { getQList } = require("../getQListMod");
const { awsSdkPromiseResponse } = require("aws-sdk");

describe("begin exam module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("exists", () => {
    expect.assertions(1);
    expect(beginExam).toBeDefined();
  });
  it("returns a string", () => {
    expect.assertions(1);
    getQList.mockReturnValueOnce(Promise.resolve(dummyAssessmentData.qList));
    awsSdkPromiseResponse.mockReturnValueOnce(
      Promise.resolve({
        Item: { markup: "This is the intro text for exam#1" },
      })
    );
    beginExam("can#abc", "exam#1").then((r) => {
      expect(typeof r).toBe("string");
    });
  });
  it("returns intro HTML", () => {
    expect.assertions(1);
    getQList.mockReturnValueOnce(Promise.resolve(dummyAssessmentData.qList));
    awsSdkPromiseResponse.mockReturnValueOnce(
      Promise.resolve({
        Item: { markup: "This is the intro text for exam#1" },
      })
    );
    beginExam("can#abc", "exam#1").then((r) => {
      expect(r).toMatch(/intro/i);
    });
  });
});
