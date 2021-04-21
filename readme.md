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
