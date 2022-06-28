function linkAchieved(examId) {
  if (typeof examId === "string" && examId.length > 5) {
    const examCode = examId.substring(5);
    return `<a href="/can/achieved/${examCode}">link to achievement 1</a>`;
  } else {
    return `<p>Invalid exam-code for exam ${examId}</p>`;
  }
}

exports.linkAchieved = linkAchieved;
