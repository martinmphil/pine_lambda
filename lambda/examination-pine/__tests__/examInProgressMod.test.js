const { examInProgress } = require("../examInProgressMod");
const { dummyAssessmentData } = require("../__mocks__/dummyAssessmentData");
const { awsSdkPromiseResponse } = require("aws-sdk");
let canId = "candidate#abc";
let examId = "exam#1";
let canAnswer = "a1";

jest.mock("../getQTextMod");
const getQTextMod = require("../getQTextMod");

jest.mock("../incrementAssessmentDataMod");
const incrementAssessmentDataMod = require("../incrementAssessmentDataMod");

describe("exam-in-progress module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("exist", () => {
    expect.assertions(1);
    expect(
      examInProgress(canId, examId, dummyAssessmentData, canAnswer)
    ).toBeDefined();
  });
  it("returns achieved-exam-link for question-index of minus one", () => {
    expect.assertions(2);
    const finishedExamData = JSON.parse(JSON.stringify(dummyAssessmentData));
    finishedExamData.qIndex = -1;
    expect(examInProgress(canId, examId, finishedExamData)).toBeDefined();
    examInProgress(canId, examId, finishedExamData, canAnswer).then(
      (result) => {
        expect(result).toContain('<a href="/can/achieved/1">');
      }
    );
  });
  it("throws a meaningful error with missing assessment-data", () => {
    expect.assertions(3);
    examInProgress(canId, examId, "", canAnswer).catch((error) => {
      expect(error).toMatch(
        /invalid assessment-data in exam-in-progress-fn for/i
      );
      expect(error).toContain(canId);
      expect(error).toContain(examId);
    });
  });
  it("throws a meaningful error with empty assessment-data", () => {
    expect.assertions(3);
    examInProgress(canId, examId, {}, canAnswer).catch((error) => {
      expect(error).toMatch(
        /invalid assessment-data in exam-in-progress-fn for/i
      );
      expect(error).toContain(canId);
      expect(error).toContain(examId);
    });
  });
  it("throws a meaningful error with empty assessment-data", () => {
    expect.assertions(3);
    examInProgress(canId, examId, {}, canAnswer).catch((error) => {
      expect(error).toMatch(
        /invalid assessment-data in exam-in-progress-fn for/i
      );
      expect(error).toContain(canId);
      expect(error).toContain(examId);
    });
  });
  it("throws a meaningful error with invalid question-index", () => {
    expect.assertions(8);
    const undefinedQIndex = JSON.parse(JSON.stringify(dummyAssessmentData));
    undefinedQIndex.qIndex = undefined;
    examInProgress(canId, examId, undefinedQIndex, canAnswer).catch((error) => {
      expect(error).toMatch(/invalid question-index/i);
      expect(error).toMatch(/exam-in-progress/i);
      expect(error).toContain(canId);
      expect(error).toContain(examId);
    });
    const missingQIndex = JSON.parse(JSON.stringify(dummyAssessmentData));
    missingQIndex.qIndex = "";
    examInProgress(canId, examId, missingQIndex, canAnswer).catch((error) => {
      expect(error).toMatch(/invalid question-index/i);
      expect(error).toMatch(/exam-in-progress/i);
      expect(error).toContain(canId);
      expect(error).toContain(examId);
    });
  });
  it("throws a meaningful error with invalid question-list", () => {
    expect.assertions(4);
    const undefinedQList = JSON.parse(JSON.stringify(dummyAssessmentData));
    undefinedQList.qList = undefined;
    examInProgress(canId, examId, undefinedQList, canAnswer).catch((error) => {
      expect(error).toMatch(/invalid question-list/i);
      expect(error).toMatch(/exam-in-progress/i);
      expect(error).toContain(canId);
      expect(error).toContain(examId);
    });
  });
  it("throws a meaningful error with empty submissions-return-value", () => {
    expect.assertions(4);
    awsSdkPromiseResponse.mockReturnValueOnce(Promise.resolve(""));
    examInProgress(canId, examId, dummyAssessmentData, canAnswer).catch(
      (error) => {
        expect(error).toMatch(/faulty submission-fn/i);
        expect(error).toMatch(/exam-in-progress/i);
        expect(error).toContain(canId);
        expect(error).toContain(examId);
      }
    );
  });
  it("returns qText-html for currentQIndex when missing candidate-answer", () => {
    expect.assertions(3);
    const spy1 = jest.spyOn(getQTextMod, "getQText");
    examInProgress(canId, examId, dummyAssessmentData).then((r) => {
      expect(spy1).toHaveBeenCalled();
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy1).toBeCalledWith("qText#1", "intro");
    });
  });
  it("updates db with qIndex to minus after last question", () => {
    expect.assertions(4);
    const spy2 = jest.spyOn(
      incrementAssessmentDataMod,
      "incrementAssessmentData"
    );
    const lastQExamData = JSON.parse(JSON.stringify(dummyAssessmentData));
    lastQExamData.qIndex = 3;
    examInProgress(canId, examId, lastQExamData, canAnswer).then((result) => {
      console.log(result);
      expect(result).toBeDefined();
      expect(spy2).toBeCalled();
      expect(spy2).toHaveBeenCalledTimes(1);
      expect(spy2).toBeCalledWith(canId, examId, -1);
    });
  });
  it("returns achieved-exam-link after last question", () => {
    expect.assertions(1);
    const lastQExamData = JSON.parse(JSON.stringify(dummyAssessmentData));
    lastQExamData.qIndex = 3;
    examInProgress(canId, examId, lastQExamData, canAnswer).then((result) => {
      expect(result).toContain('<a href="/can/achieved/1">');
    });
  });
  //
});
