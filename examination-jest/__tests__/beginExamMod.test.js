const { beginExam } = require("../beginExamMod");
// const { awsSdkPromiseResponse } = require("aws-sdk");

describe("start exam fn", () => {
  it("exists", () => {
    expect(beginExam).toBeDefined();
  });
});
