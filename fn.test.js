const fn = require("./fn");

test("3초 후에 받아온 이름은 Mike", (done) => {
  function callback(name) {
    try {
      expect(name).toBe("Mike");
      done();
    } catch (error) {
      done();
    }
  }
  fn.getName(callback);
});

test("0 + 1 은 1 이야", () => {
  expect(fn.add(0, 1)).toBe(1);
});
