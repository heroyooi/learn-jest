# Learn Jest

```command
npm init
npm i jest -D
```

- npm test 명령어를 실행하면 프로젝트 내에 모든 test 파일들을 찾아서 테스트 한다.(test, \_\_test\_\_)

## 유용한 Matchers

- fn.js

```js
const fn = {
  add: (num1, num2) => num1 + num2,
  makeUser: (name, age) => ({ name, age, gender: undefined }),
  throwErr: () => {
    throw new Error("xx");
  },
};

module.exports = fn;
```

- [유용한 Matchers](https://jestjs.io/docs/en/expect)

- fn.test.js

```js
const fn = require("./fn");

// O
test("1은 1이야.", () => {
  expect(1).toBe(1);
});

// O
test("2 더하기 3은 5야.", () => {
  expect(fn.add(2, 3)).toBe(5);
});

// O
test("3 더하기 3은 5가 아니야.", () => {
  expect(fn.add(3, 3)).not.toBe(5);
});

// O
test("2 더하기 3은 5야.", () => {
  expect(fn.add(2, 3)).toEqual(5);
});

// X
test("이름과 나이를 전달받아서 객체를 반환해줘", () => {
  expect(fn.makeUser("SungYeonwook", 37)).toStrictEqual({
    name: "SungYeonwook",
    age: 37,
  });
});

// O
test("null은 null입니다.", () => {
  expect(null).toBeNull();
});
// toBeUndefined
// toBeDefined

// O
test("0은 false입니다.", () => {
  expect(fn.add(1, -1)).toBeFalsy();
});

// O
test("비어있지 않은 문자열은 true 입니다.", () => {
  expect(fn.add("hello", "world")).toBeTruthy();
});

// toBeGreaterThan 크다
// toBeGreaterThanOrEqual 크거나 같다
// toBeLessThan 작다
// toBeLessThanOrEqual 작거나 같다
// X
test("ID는 10자 이하여야 합니다.", () => {
  const id = "THE_BLACK_ORDER";
  expect(id.length).toBeLessThanOrEqual(10);
});

// O
test("0.1 더하기 0.2 는 0.3 입니다.", () => {
  expect(fn.add(0.1, 0.2)).toBeCloseTo(0.3);
});

// X
test("Hello World 에 a 라는 글자가 있나?", () => {
  expect("Hello World").toMatch(/a/);
});

// O
test("Hello World 에 a 라는 글자가 있나?", () => {
  expect("Hello World").toMatch(/h/i);
});

// X
test("유저 리스트에 Mike가 있나?", () => {
  const user = "Mike";
  const userList = ["Tom", "Jane", "Kai"];
  expect(userList).toContain(user);
});

// O
test("이거 에러 나나요?", () => {
  expect(() => fn.throwErr().toThrow("xx")); // 특정 에러가 나는지 테스트할 수 있다.
});
```

- npm test 로 실행하면 실행 결과가 나온다.

## 비동기 코드 테스트

### 콜백 패턴

#### 성공 예제

- fn.js

```js
const fn = {
  getName: (callback) => {
    const name = "Mike";
    setTimeout(() => {
      callback(name);
    }, 3000);
  },
};

module.exports;
```

- fn.test.js

```js
// O, 3초 후 성공
test("3초 후에 받아온 이름은 Mike", (done) => {
  function callback(name) {
    expect(name).toBe("Mike");
    done();
  }
  fn.getName(callback);
});
```

#### 실패 예제

- fn.js

```js
const fn = {
  getName: (callback) => {
    setTimeout(() => {
      throw new Error("서버 에러..");
    }, 3000);
  },
};

module.exports;
```

- fn.test.js

```js
// X, 3초 후 서버 에러
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
```

### Promise 패턴

#### 성공 예제

- fn.js

```js
const fn = {
  getAge: (callback) => {
    const age = 30;
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(age);
      }, 3000);
    });
  },
};

module.exports;
```

- fn.test.js

```js
// O, 3초 후 성공
test("3초 후에 받아온 나이는 30", () => {
  // return fn.getAge().then((age) => {
  //   expect(age).toBe(30);
  // });
  return expect(fn.getAge()).resolves.toBe(30);
});
```

- Promise는 return을 꼭 해줘야 제대로 테스트가 된다.
- resolves 매쳐로도 테스트가 가능하다.

#### 실패 예제

- fn.js

```js
const fn = {
  getAge: (callback) => {
    const age = 30;
    return new Promise((res, rej) => {
      setTimeout(() => {
        rej("error");
      }, 3000);
    });
  },
};

module.exports;
```

- fn.test.js

```js
// X, 3초 후 실패
test("3초 후에 받아온 나이는 30", () => {
  return expect(fn.getAge()).rejects.toBe(30);
});

// O, 에러 메세지가 동일한 지 테스트
test("3초 후에 에러가 납니다.", () => {
  return expect(fn.getAge()).rejects.toMatch("error");
});
```

### async, await 패턴

#### 성공 예제

- fn.test.js

```js
// O, 3초 후 성공
test("3초 후 나이 30", async () => {
  const age = await fn.getAge();
  expect(age).toBe(30);
});
```

```js
// O, 3초 후 성공
test("3초 후 나이 30", async () => {
  await expect(fn.getAge()).resolves.toBe(30);
});
```

## 테스트 전후 작업

### beforeEach, afterEach

```js
let num = 10;

beforeEach(() => {
  num = 0;
});

test("0 더하기 1 은 1 이야", () => {
  num = fn.add(num, 1);
  expect(num).toBe(1);
});

test("0 더하기 2 은 2 이야", () => {
  num = fn.add(num, 2);
  expect(num).toBe(2);
});

test("0 더하기 3 은 3 이야", () => {
  num = fn.add(num, 3);
  expect(num).toBe(3);
});
```

- 그냥 테스트를 하면 num 값이 의도와 다르게 바뀌므로, 테스트 별로 num을 초기화해주는 beforeEach 혹은 afterEach를 사용한다.

### beforeAll, afterAll

- fn.js

```js
const fn = {
  connectUserDb: () => {
    return new Promise((res) => {
      setTimeout(() => {
        res({
          name: "Mike",
          age: 30,
          gender: "male",
        });
      }, 500);
    });
  },
  disconnectDb: () => {
    return new Promise((res) => {
      setTimeout(() => {
        res();
      }, 500);
    });
  },
};

module.exports = fn;
```

- fn.test.js

```js
const fn = require("./fn");

let user;

beforeAll(async () => {
  user = await fn.connectUserDb();
});

afterAll(() => {
  return fn.disconnectDb();
});

test("이름은 Mike", () => {
  expect(user.name).toBe("Mike");
});
test("나이는 30", () => {
  expect(user.age).toBe(30);
});
test("성별은 남성", () => {
  expect(user.gender).toBe("male");
});
```

- 여러 테스트 전후로 한번만 실행시키려면, beforeAll, afterAll을 사용하면 된다.

### beforeAll, beforeEach, afterEach, afterAll, describe 실행 순서

```js
const fn = require("./fn");

beforeAll(() => console.log("밖 beforeAll")); // 1
beforeEach(() => console.log("밖 beforeEach")); // 2, 6
afterEach(() => console.log("밖 afterEach")); // 4
afterAll(() => console.log("밖 afterAll")); // 마지막

test("0 + 1 = 1", () => {
  expect(fn.add(0, 1)).toBe(1); // 3
});

describe("describe 작업", () => {
  beforeAll(() => console.log("안 beforeAll")); // 5
  beforeEach(() => console.log("안 beforeEach")); // 7
  afterEach(() => console.log("안 afterEach")); // 9
  afterAll(() => console.log("안 afterAll")); // 마지막 -1

  test("0 + 1 = 1", () => {
    expect(fn.add(0, 1)).toBe(1); // 8
  });
});
```

- 밖에 있는 beforeAll과 afterAll은 처음과 마지막에 실행된다.
- test 전후로 beforeEach와 afterEach가 실행된다.
- 안에 있는 test가 실행되기 전에 밖 beforeEach, 안 beforeEach, 실행된 후에 안 afterEach, 밖 afterEach가 실행된다.
- 밖에 있는 beforeEach는 안에 있는 beforeEach보다 항상 먼저 실행된다.

### test.only, test.skip

```js
const fn = require("./fn");

let num = 0;

test("0 더하기 1 은 1", () => {
  expect(fn.add(num, 1)).toBe(1);
});

test.skip("0 더하기 2 은 2", () => {
  expect(fn.add(num, 2)).toBe(2);
  num = 10;
});

test("0 더하기 3 은 3", () => {
  expect(fn.add(num, 3)).toBe(3);
});
```

- test.only는 나머지는 건너뛰고 해당 테스트만 실행
- test.skip은 해당 테스트는 건너뜀

## 강좌

[듣던 강좌](https://www.youtube.com/watch?v=9xBjErtlr1o&list=PLZKTXPmaJk8L1xCg_1cRjL5huINlP2JKt&index=5)
