const { handler } = require("../index");
const { dummyAssessmentData } = require("../__mocks__/dummyAssessmentData");

jest.mock("../getAssessmentDataMod");
const { getAssessmentData } = require("../getAssessmentDataMod");

jest.mock("../examInProgressMod");
const { examInProgress } = require("../examInProgressMod");
examInProgress.mockReturnValue(Promise.resolve("<p>progressing</p>"));

jest.mock("../beginExamMod");
const { beginExam } = require("../beginExamMod");
beginExam.mockReturnValue(Promise.resolve("<p>beginning</p>"));

const dummyEvent = {
  body: "a1",
  pathParameters: { idNbr: "1" },
  requestContext: {
    authorizer: {
      jwt: {
        claims: {
          username: "dummy_user",
        },
      },
    },
  },
};

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
  it("resolves with body property via examInProgress when assessment-data exists", () => {
    expect.assertions(2);
    getAssessmentData.mockReturnValueOnce(Promise.resolve(dummyAssessmentData));
    handler(dummyEvent).then((result) => {
      expect(result).toHaveProperty("body");
      expect(result.body).toMatch(/progress/i);
    });
  });
  it("resolves with body property via beginExam when assessment-data is undefined", () => {
    expect.assertions(2);
    getAssessmentData.mockReturnValueOnce(Promise.resolve(undefined));
    handler(dummyEvent).then((result) => {
      expect(result).toHaveProperty("body");
      expect(result.body).toMatch(/begin/i);
    });
  });
});
