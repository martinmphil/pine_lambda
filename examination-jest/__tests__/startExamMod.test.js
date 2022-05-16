const { startExam } = require("../startExamMod");
// const { awsSdkPromiseResponse } = require("aws-sdk");

describe("start exam fn", () => {
  it("exists", () => {
    expect(startExam).toBeDefined();
  });
});
