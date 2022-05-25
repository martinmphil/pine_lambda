const { validateQList } = require("../validateQListMod");

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

describe("validateQListMod", () => {
  it("fn exists", () => {
    expect(validateQList(good_list)).toBeDefined();
  });

  it("validates only good_input", () => {
    expect.assertions(5);
    expect(validateQList(good_list)).toBe(true);
    expect(validateQList(bad_list001)).toBe(false);
    expect(validateQList(bad_list002)).toBe(false);
    expect(validateQList(bad_list003)).toBe(false);
    expect(validateQList(bad_list004)).toBe(false);
  });
});
