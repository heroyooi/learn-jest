const mockFn = jest.fn();

mockFn(10, 20);
mockFn();
mockFn(30, 40);

test("한번 이상 호출?", () => {
  expect(mockFn).toBeCalled(); // 한 번이라도 호출됐으면 통과
});

test("정확히 세번 호출?", () => {
  expect(mockFn).toBeCalledTimes(3); // 정확한 호출 횟수
});

test("10이랑 20 전달받은 함수가 있는가?", () => {
  expect(mockFn).toBeCalledWith(10, 20); // 인수로 어떤 값을 받았는지 체크
});

test("마지막 함수는 30이랑 40 받았음?", () => {
  expect(mockFn).lastCalledWith(30, 40); // 인수를 체크하는데 마지막으로 실행된 함수만 체크
});
