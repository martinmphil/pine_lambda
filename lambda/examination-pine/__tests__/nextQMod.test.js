const { nextQ } = require("../nextQMod");
jest.mock("../incrementAssessmentDataMod");
const incrementAssessmentDataMod = require("../incrementAssessmentDataMod");
jest.mock("../initSubmissionMod");
const initSubmissionMod = require("../initSubmissionMod");
jest.mock("../getQTextMod");
const getQTextMod = require("../getQTextMod");
getQTextMod.getQText.mockReturnValue(
  Promise.resolve("<p>dummy question text</p>")
);

describe("next question module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("exists", () => {
    expect.assertions(1);
    nextQ("can#abc", "exam#123", 1, "qText#2", "4Multichoice").then((r) => {
      expect(r).toBeDefined();
    });
  });
  it("calls incrementAssessmentDataMod correctly", () => {
    expect.assertions(3);
    const spy1 = jest.spyOn(
      incrementAssessmentDataMod,
      "incrementAssessmentData"
    );
    nextQ("can#abc", "exam#123", 1, "qText#2", "4Multichoice").then((r) => {
      expect(spy1).toHaveBeenCalled();
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy1).toBeCalledWith("can#abc", "exam#123", 1);
    });
  });
  it("calls initSubmissionMod correctly", () => {
    expect.assertions(3);
    const spy2 = jest.spyOn(initSubmissionMod, "initSubmission");
    nextQ("can#abc", "exam#123", 1, "qText#2", "4Multichoice").then((r) => {
      expect(spy2).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalledTimes(1);
      expect(spy2).toBeCalledWith("can#abc", "qText#2");
    });
  });
  it("calls getQText correctly", () => {
    expect.assertions(3);
    const spy3 = jest.spyOn(getQTextMod, "getQText");
    nextQ("can#abc", "exam#123", 1, "qText#2", "4Multichoice").then((r) => {
      expect(spy3).toHaveBeenCalled();
      expect(spy3).toHaveBeenCalledTimes(1);
      expect(spy3).toBeCalledWith("qText#2", "4Multichoice");
    });
  });
  it("returns a string", () => {
    expect.assertions(1);
    nextQ("can#abc", "exam#123", 1, "qText#2", "4Multichoice").then((r) => {
      expect(typeof r).toBe("string");
    });
  });
});
