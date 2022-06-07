const dummyQList = [
  { pKey: "qText#1", sKey: "intro" },
  { pKey: "qText#2", sKey: "4Multichoice" },
  { pKey: "qText#3", sKey: "4Multichoice" },
  { pKey: "qText#99", sKey: "outro" },
];

const getQList = jest.fn().mockReturnValue(Promise.resolve(dummyQList));

exports.getQList = getQList;
