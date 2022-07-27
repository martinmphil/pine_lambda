function achieved(mark, outOf, grade) {
  const percent = Math.round((mark / outOf) * 100);
  let achievement = `You achieved ${percent}%`;
  if (typeof grade === "string" && grade.length > 0) {
    achievement += ` for a grade of <strong>${grade}</strong>`;
  }
  return `
  <p class="achieved">${achievement}.</p>
  <button class="jump-to-disciplines" type="button">
  Continue
  </button>
  `;
}

exports.achieved = achieved;
