const dummyAssessmentData = {
  pk: "candidate#123",
  sk: "exam#1",
  entityType: "assessmentData",
  qList: [
    { pKey: "qText#1", sKey: "intro" },
    { pKey: "qText#2", sKey: "4Multichoice" },
    { pKey: "qText#3", sKey: "4Multichoice" },
    { pKey: "qText#99", sKey: "outro" },
  ],
};

const getAssessmentData = jest
  .fn()
  .mockReturnValue(Promise.resolve(dummyAssessmentData));

exports.getAssessmentData = getAssessmentData;
