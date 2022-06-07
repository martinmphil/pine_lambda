const { getQList, validQList } = require("../getQListMod");
const { awsSdkPromiseResponse } = require("aws-sdk");

const good_list = [
  {
    pKey: "qText#1",
    sKey: "intro",
  },
  {
    pKey: "qText#2",
    sKey: "4Multichoice",
  },
];

const bad_list001 = [
  {
    sKey: "dummy",
  },
  {
    pKey: "dummy",
    sKey: "dummy",
  },
];

const bad_list002 = [
  {
    pKey: "dummy",
    sKey: "dummy",
  },
  {
    pKey: "dummy",
    missing_sKey: "dummy",
  },
];

const bad_list003 = [
  {
    pKey: "dummy",
    sKey: "dummy",
  },
  {
    pKey: "dummy",
    sKey: "",
  },
];

const bad_list004 = [
  {
    pKey: "dummy",
    sKey: "dummy",
  },
  {
    pKey: 1234,
    sKey: "dummy",
  },
];

describe("get-question-list module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("exists", () => {
    expect.assertions(1);
    expect(getQList).toBeDefined();
  });

  it("returns an array", async () => {
    expect.assertions(4);
    awsSdkPromiseResponse.mockReturnValueOnce(
      Promise.resolve({
        Item: {
          qList: good_list,
        },
      })
    );
    const x = await getQList("exam#1");
    expect(x[0].pKey).toBe("qText#1");
    expect(x[0].sKey).toBe("intro");
    expect(x[1].pKey).toBe("qText#2");
    expect(x[1].sKey).toBe("4Multichoice");
  });

  it("throws informative error for invalid q-list", async () => {
    expect.assertions(2);
    awsSdkPromiseResponse.mockReturnValueOnce(
      Promise.resolve({
        Item: {
          qList: bad_list001,
        },
      })
    );

    try {
      await getQList("exam#1");
    } catch (error) {
      expect(error).toMatch(/invalid/i);
      expect(error).toMatch(/exam#1/i);
    }
  });
});
