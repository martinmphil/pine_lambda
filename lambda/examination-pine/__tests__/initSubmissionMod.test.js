const initSubmissionMod = require("../initSubmissionMod");

const initSubmission = initSubmissionMod.initSubmission;

jest.mock("../putDbItemMod");

describe("initilizing submission module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("exists", async () => {
    expect.assertions(1);
    expect(initSubmission("can#abc", "qText#1")).toBeDefined();
  });

  it("calls putDBItem with correct args", async () => {
    expect.assertions(3);
    const spy1 = jest
      .spyOn(initSubmissionMod, "putDbItem")
      .mockResolvedValueOnce(true);
    await initSubmission("can#abc", "qText#1");
    expect(spy1).toHaveBeenCalled();
    expect(spy1).toBeCalledTimes(1);
    expect(spy1).toHaveBeenCalledWith(
      expect.objectContaining({
        ConditionExpression: "attribute_not_exists(pk)",
        TableName: "pine",
        Item: expect.objectContaining({
          createdAt: expect.any(String),
          entityType: "submissionData",
          pk: "can#abc",
          sk: "qText#1",
        }),
      })
    );
  });
});

expect.any(Number);
