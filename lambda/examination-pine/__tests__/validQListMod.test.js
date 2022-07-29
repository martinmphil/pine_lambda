const { validQList } = require("../validQListMod");

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

describe("valid-question-list module", () => {
  it("fn exists", () => {
    expect(validQList(good_list)).toBeDefined();
  });

  it("validates only good_input", () => {
    expect.assertions(5);
    expect(validQList(good_list)).toBe(true);
    expect(validQList(bad_list001)).toBe(false);
    expect(validQList(bad_list002)).toBe(false);
    expect(validQList(bad_list003)).toBe(false);
    expect(validQList(bad_list004)).toBe(false);
  });
});
