const fn = require("./fn");

test("3초 후 나이 30", async () => {
  await expect(fn.getAge()).resolves.toBe(30);
});
