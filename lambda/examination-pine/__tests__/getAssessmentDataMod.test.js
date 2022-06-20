const { getAssessmentData } = require("../getAssessmentDataMod");
const { awsSdkPromiseResponse } = require("aws-sdk");
const { dummyAssessmentData } = require("../__mocks__/dummyAssessmentData");

describe("get-assessment-data module", () => {
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
  it("returns a db Item", () => {
    expect.assertions(1);
    awsSdkPromiseResponse.mockReturnValueOnce(
      Promise.resolve({ Item: dummyAssessmentData })
    );
    getAssessmentData("can#abc", "exam#1").then((result) => {
      expect(result).toBe(dummyAssessmentData);
    });
  });
  it("returns false for missing assessment-data", () => {
    expect.assertions(2);
    awsSdkPromiseResponse.mockReturnValueOnce(Promise.resolve({}));
    getAssessmentData("can#abc", "exam#1").then((x) => {
      expect(x).toBe(false);
    });
    awsSdkPromiseResponse.mockReturnValueOnce(Promise.resolve({ Item: {} }));
    getAssessmentData("can#abc", "exam#1").then((x) => {
      expect(x).toBe(false);
    });
  });
  it("throws meaningful error for invalid question-index", () => {
    expect.assertions(4);
    const badQIndexData = { ...dummyAssessmentData };
    badQIndexData["qIndex"] = "a";
    awsSdkPromiseResponse.mockReturnValueOnce(
      Promise.resolve({ Item: badQIndexData })
    );
    getAssessmentData("can#abc", "exam#1").catch((error) => {
      expect(error).toMatch(/invalid/i);
      expect(error).toMatch(/question-index on assessment-data/i);
      expect(error).toMatch(/can#abc/i);
      expect(error).toMatch(/exam#1/i);
    });
  });
  it("throws meaningful error for invalid question-list", () => {
    expect.assertions(4);
    const badQListData = { ...dummyAssessmentData };
    badQListData["qList"] = "";
    awsSdkPromiseResponse.mockReturnValueOnce(
      Promise.resolve({ Item: badQListData })
    );
    getAssessmentData("can#abc", "exam#1").catch((error) => {
      expect(error).toMatch(/invalid/i);
      expect(error).toMatch(/question-list on assessment-data/i);
      expect(error).toMatch(/can#abc/i);
      expect(error).toMatch(/exam#1/i);
    });
  });
  it("throws meaningful error for empty question-list array", () => {
    expect.assertions(4);
    const emptyQListData = { ...dummyAssessmentData };
    emptyQListData["qList"] = [];
    awsSdkPromiseResponse.mockReturnValueOnce(
      Promise.resolve({ Item: emptyQListData })
    );
    getAssessmentData("can#abc", "exam#1").catch((error) => {
      expect(error).toMatch(/invalid/i);
      expect(error).toMatch(/question-list on assessment-data/i);
      expect(error).toMatch(/can#abc/i);
      expect(error).toMatch(/exam#1/i);
    });
  });
  it("throws meaningful error for missing pKey in question-list array", () => {
    expect.assertions(4);
    const missingPKeyData = JSON.parse(
      JSON.stringify({ ...dummyAssessmentData })
    );
    missingPKeyData["qList"][1]["pKey"] = "";
    awsSdkPromiseResponse.mockReturnValueOnce(
      Promise.resolve({ Item: missingPKeyData })
    );
    getAssessmentData("can#abc", "exam#1").catch((error) => {
      expect(error).toMatch(/invalid/i);
      expect(error).toMatch(/question-list on assessment-data/i);
      expect(error).toMatch(/can#abc/i);
      expect(error).toMatch(/exam#1/i);
    });
  });
  it("throws meaningful error for invalid sKey in question-list array", () => {
    expect.assertions(4);
    const invalidSKeyData = JSON.parse(
      JSON.stringify({ ...dummyAssessmentData })
    );
    invalidSKeyData["qList"][0]["sKey"] = 123;
    awsSdkPromiseResponse.mockReturnValueOnce(
      Promise.resolve({ Item: invalidSKeyData })
    );
    getAssessmentData("can#abc", "exam#1").catch((error) => {
      expect(error).toMatch(/invalid/i);
      expect(error).toMatch(/question-list on assessment-data/i);
      expect(error).toMatch(/can#abc/i);
      expect(error).toMatch(/exam#1/i);
    });
  });
});
