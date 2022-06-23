const { getQText } = require("../getQTextMod");
const { awsSdkPromiseResponse } = require("aws-sdk");

describe("get-question-text module", () => {
  it("exists", () => {
    expect.assertions(2);
    awsSdkPromiseResponse.mockReturnValueOnce(
      Promise.resolve({
        Item: { markup: "This is the intro text qText#123" },
      })
    );
    expect(getQText).toBeDefined();
    getQText("qText#123", "intro").then((r) => {
      expect(r).toBeDefined();
    });
  });
  it("returns a string", () => {
    expect.assertions(1);
    awsSdkPromiseResponse.mockReturnValueOnce(
      Promise.resolve({
        Item: { markup: "This is the intro text qText#123" },
      })
    );
    getQText("qText#123", "intro").then((r) => {
      expect(typeof r).toBe("string");
    });
  });
  it("returns intro HTML", () => {
    expect.assertions(2);
    awsSdkPromiseResponse.mockReturnValueOnce(
      Promise.resolve({
        Item: { markup: "This is the intro text qText#123" },
      })
    );
    getQText("qText#123", "intro").then((r) => {
      expect(r).toMatch(/intro/i);
      expect(r).toMatch(/qText#123/i);
    });
  });
  it("throws meaningful error when html missing", () => {
    expect.assertions(3);
    awsSdkPromiseResponse.mockReturnValueOnce(
      Promise.resolve({
        Item: {},
      })
    );
    getQText("qText#123", "intro").catch((error) => {
      expect(error).toMatch(/Get-question-text failed/i);
      expect(error).toMatch(/qText#123/i);
      expect(error).toMatch(/intro/i);
    });
  });
});
