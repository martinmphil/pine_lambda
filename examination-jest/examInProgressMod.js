async function examInProgress(canId, examId, canAnswer) {
  return `exam in progress ${canId + examId + canAnswer}`;
}

exports.examInProgress = examInProgress;
