const { dummyAssessmentData } = require("./dummyAssessmentData");

const getAssessmentData = jest
  .fn()
  .mockReturnValue(Promise.resolve(dummyAssessmentData));

exports.getAssessmentData = getAssessmentData;
