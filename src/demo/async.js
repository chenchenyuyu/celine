// 模拟异步数据执行
const fetchData = (args) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`异步数据${args}`);
    }, 2000);
  })
}

// Generator 异步函数
function* genFetch() {
  console.log('开始请求1');
  const res1 = yield fetchData(1); // 暂停，等待 Promise 完成
  console.log('请求1完成：', res1);
  
  console.log('开始请求2');
  const res2 = yield fetchData(2); // 再次暂停
  console.log('请求2完成：', res2);
  
  return res1 + ',' + res2; // return标识结束执行, 标识done为true
}

// 手动执行 Generator（痛点：需要手动调用 next()，无法自动执行）
const gen = genFetch();
console.log('gen', gen)
// 第一次 next()：执行到第一个 yield，返回 Promise（fetchData(1)）
// next().value返回一个promise对象 then函数执行结果

gen.next().value.then(res1 => {
  console.log('res1', res1)
  // 第二次 next(res1)：将 res1 传入 Generator，恢复执行到第二个 yield
  gen.next(res1).value.then(res2 => {
    console.log('res2', res2)
    // 第三次 next(res2)：执行到函数结束
    gen.next(res2);
  });
});


function *genFunction() {
  yield 'result1';
  yield 'result2';
  yield 'result3';
  return 'final result';
}

gen = genFunction();
console.log('gen', gen)

console.log('gen.next1()',gen.next());
console.log('gen.next2()',gen.next());
console.log('gen.next3()',gen.next());
console.log('gen.next4()',gen.next());