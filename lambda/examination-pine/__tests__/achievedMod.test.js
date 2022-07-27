const { achieved } = require("../achievedMod");
describe("link-achieved ", () => {
  it("exists", () => {
    expect.assertions(1);
    expect(achieved("exam#1")).toBeDefined();
  });
  it("dsiplays exam achievement", () => {
    expect.assertions(1);
    const html = achieved(4, 10, "pass");
    expect(html).toContain('<p class="achieved">');
  });
  it("dsiplays percent achievement", () => {
    expect.assertions(1);
    const html = achieved(4, 10, "pass");
    expect(html).toContain("40%");
  });
});
