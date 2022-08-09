const { markExam } = require("../markExamMod");

let dummyAssessmentData = {
  pk: "candidate#abc",
  sk: "exam#1",
  entityType: "assessmentData",
  qIndex: 0,
  qList: [
    { pKey: "qText#2", sKey: "4Multichoice" },
    { pKey: "qText#3", sKey: "4Multichoice" },
  ],
};
let canId = "candidate#abc";
let examId = "exam#1";

jest.mock("../achievedMod");
const achievedMod = require("../achievedMod");

jest.mock("../getDbItemMod");
const getDbItemMod = require("../getDbItemMod");

jest.mock("../getQListMod");
const getQListMod = require("../getQListMod");

jest.mock("../putDbItemMod");
const putDbItemMod = require("../putDbItemMod");

describe("mark exam function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getQListMod.getQList.mockImplementation(() =>
      Promise.resolve(dummyAssessmentData.qList)
    );
    getDbItemMod.getDbItem
      .mockImplementation(() =>
        Promise.resolve({ Item: { rubric: { a4: 1 } } })
      )
      .mockImplementation(() =>
        Promise.resolve({ Item: { candidateAnswer: "a4" } })
      );
    achievedMod.achieved.mockImplementation(() => "achieved");
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("exists", () => {
    expect(markExam).toBeDefined();
  });

  it("requests question-list for examId", () => {
    expect.assertions(4);
    const spy1 = jest.spyOn(getQListMod, "getQList");
    markExam(canId, examId, dummyAssessmentData).then((result) => {
      expect(result).toBeDefined();
      expect(spy1).toBeCalled();
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy1).toBeCalledWith(examId);
    });
  });

  it("puts mark into database", () => {
    expect.assertions(4);
    const spy1 = jest.spyOn(putDbItemMod, "putDbItem");
    markExam(canId, examId, dummyAssessmentData).then((result) => {
      expect(result).toBeDefined();
      expect(spy1).toBeCalled();
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy1).toBeCalledWith(
        expect.objectContaining({
          Item: expect.objectContaining({ pk: "candidate#abc", sk: "exam#1" }),
        })
      );
    });
  });
});
