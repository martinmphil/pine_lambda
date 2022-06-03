const { awsSdkPromiseResponse } = require("aws-sdk");
const { putDbItem, dynamo } = require("../putDbItemMod");
jest.mock("aws-sdk");

const putParamObj = {
  TableName: "pine",
  Item: {
    pk: "can#abc",
    sk: "qTex#1",
    entityType: "submissionData",
    createdAt: "now",
  },
  ConditionExpression: "attribute_not_exists(pk)",
};

describe("put db Item module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("exists", async () => {
    expect.assertions(1);
    expect(putDbItem).toBeDefined();
  });

  it("returns empty object", async () => {
    expect.assertions(1);
    awsSdkPromiseResponse.mockReturnValueOnce(Promise.resolve({}));
    const putItem = await putDbItem(putParamObj);
    expect(putItem).toStrictEqual({});
  });

  it("calls dynamo.put", async () => {
    expect.assertions(3);
    const spy1 = jest.spyOn(dynamo, "put");
    const putItem = await putDbItem(putParamObj);
    expect(spy1).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy1).toBeCalledWith(putParamObj);
  });

  it("throws when missing table-name", async () => {
    expect.assertions(2);
    const paramsMissingTableName = {
      TableName: "",
      Item: {
        pk: "can#abc",
        sk: "qTex#1",
        entityType: "submissionData",
        createdAt: "now",
      },
    };
    try {
      await putDbItem(paramsMissingTableName);
    } catch (error) {
      expect(error).toMatch(/missing/i);
      expect(error).toMatch(/table-name/i);
    }
  });

  it("throws when missing pk", async () => {
    expect.assertions(2);
    const pkInvalid = {
      TableName: "pine",
      Item: {
        pk: "",
        sk: "qTex#1",
        entityType: "submissionData",
        createdAt: "now",
      },
    };
    try {
      await putDbItem(pkInvalid);
    } catch (error) {
      expect(error).toMatch(/missing/i);
      expect(error).toMatch(/partition-key/i);
    }
  });

  it("throws when missing sk", async () => {
    expect.assertions(2);
    const skInvalid = {
      TableName: "pine",
      Item: {
        pk: "can#abc",
        sk: 123,
        entityType: "submissionData",
        createdAt: "now",
      },
    };
    try {
      await putDbItem(skInvalid);
    } catch (error) {
      expect(error).toMatch(/missing/i);
      expect(error).toMatch(/sort-key/i);
    }
  });
});
