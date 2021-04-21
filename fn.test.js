const fn = require("./fn");

let num = 0;

test("0 더하기 1 은 1", () => {
  expect(fn.add(num, 1)).toBe(1);
});

test("0 더하기 2 은 2", () => {
  expect(fn.add(num, 2)).toBe(2);
  num = 10;
});

test.only("0 더하기 3 은 3", () => {
  expect(fn.add(num, 3)).toBe(3);
});
