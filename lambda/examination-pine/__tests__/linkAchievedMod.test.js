const { linkAchieved } = require("../linkAchievedMod");
describe("link-achieved ", () => {
  it("exists", () => {
    expect.assertions(1);
    expect(linkAchieved("exam#1")).toBeDefined();
  });
  it("sends user a link to thier achievment", () => {
    expect.assertions(3);
    const html = linkAchieved("exam#1");
    expect(html).toContain("<a");
    expect(html).toContain('href="/can/achieved');
    expect(html).toContain("</a>");
  });
  it("sends user a link to achievment 1", () => {
    expect.assertions(3);
    const html = linkAchieved("exam#1");
    expect(html).toContain("<a");
    expect(html).toContain('href="/can/achieved/1');
    expect(html).toContain("</a>");
  });
  it("sends user a link to achievment 2", () => {
    expect.assertions(3);
    const html = linkAchieved("exam#2");
    expect(html).toContain("<a");
    expect(html).toContain('href="/can/achieved/2');
    expect(html).toContain("</a>");
  });
});
