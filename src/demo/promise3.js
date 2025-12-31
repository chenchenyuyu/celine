class MyPromise {
  // 1. 初始化状态和回调队列
  constructor(executor) {
    this.status = 'pending'; // 初始状态
    this.value = undefined;  // 成功值
    this.reason = undefined; // 失败原因
    this.onFulfilledCallbacks = []; // 成功回调队列
    this.onRejectedCallbacks = [];  // 失败回调队列

    // 2. 定义 resolve 方法：改变状态 + 执行成功回调
    const resolve = (value) => {
      if (this.status === 'pending') {
        this.status = 'fulfilled';
        this.value = value;
        // 异步执行所有成功回调（模拟微任务）
        this.onFulfilledCallbacks.forEach(cb => cb(this.value));
      }
    };

    // 3. 定义 reject 方法：改变状态 + 执行失败回调
    const reject = (reason) => {
      if (this.status === 'pending') {
        this.status = 'rejected';
        this.reason = reason;
        // 异步执行所有失败回调
        this.onRejectedCallbacks.forEach(cb => cb(this.reason));
      }
    };

    // 4. 立即执行 executor，捕获执行错误
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  // 5. then 方法：注册回调 + 支持链式调用
  then(onFulfilled, onRejected) {
    // 兼容不传回调的情况（透传值/错误）
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };

    // 返回新 Promise，实现链式调用
    const newPromise = new MyPromise((resolve, reject) => {
      // 状态已完成：直接异步执行回调
      if (this.status === 'fulfilled') {
        setTimeout(() => { // 模拟微任务（实际是 queueMicrotask）
          try {
            const result = onFulfilled(this.value);
            // 回调返回值可能是 Promise，需递归解析
            resolvePromise(newPromise, result, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }

      if (this.status === 'rejected') {
        setTimeout(() => {
          try {
            const result = onRejected(this.reason);
            resolvePromise(newPromise, result, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }

      // 状态未完成：加入回调队列
      if (this.status === 'pending') {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const result = onFulfilled(this.value);
              resolvePromise(newPromise, result, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });

        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const result = onRejected(this.reason);
              resolvePromise(newPromise, result, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });

    return newPromise;
  }

  // catch 方法：简化 then 的失败回调
  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

// 辅助函数：解析回调返回值（处理返回 Promise 的情况）
function resolvePromise(newPromise, result, resolve, reject) {
  if (result === newPromise) {
    reject(new TypeError('Chaining cycle detected')); // 避免循环引用
  }
  if (result instanceof MyPromise) {
    result.then(resolve, reject); // 递归解析 Promise
  } else {
    resolve(result); // 普通值直接 resolve
  }
}

// 测试
const p = new MyPromise((resolve) => {
  setTimeout(() => resolve(100), 1000);
});
p.then(val => {
  console.log(val); // 100
  return val * 2; // 返回新的值，通过then函数进行调用取值
}).then(val => console.log(val)); // 200