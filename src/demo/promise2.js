
// promise 
let p1 = new Promise((resolve, reject) => {
  resolve('成功');
  reject('失败');
});

console.log(p1);

let p2 = new Promise((resolve, reject) => {
  resolve('失败');
  reject('成功');
});

console.log(p2);

let p3 = new Promise((resolve, reject) => {
  throw('报错');
});

console.log(p3);

// 1. promise state 状态pending -> fulfilled或rejected
// 2. promise result
// 3. 状态不可以改变
// 4. promise 里面有throw使用try catch
// 5. setTimeout

// NOTE: 1. 回调函数接收状态
class Promise2 {
  constructor(fn) {
    // 初始值
    this.promiseResult = null;
    this.promiseState = 'pending';
    // 绑定函数
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);

    // 保存异步回调
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    // promise 里面有throw使用try catch
    try {
      fn(this.resolve, this.reject);
    } catch(e) {
      this.reject(e);
    }
  }

  resolve(value) {
    if (this.PromiseState !== 'pending') return //保持状态不可变
    this.promiseState = 'fulfilled';
    this.promiseResult = value;

    // 执行成功的回调
    while(this.onFulfilledCallbacks.length) {
      this.onFulfilledCallbacks.shift()(this.promiseResult);
    }
  }

  reject(reason) {
    if (this.PromiseState !== 'pending') return // 保持状态不可变
    this.promiseState = 'rejected';
    this.promiseResult = reason;

    //执行失败的回调
    while(this.onRejectedCallbacks.length) {
      this.onRejectedCallbacks.shift()(this.promiseResult);
    }
  }

  // then函数, 最终值回调函数
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

    if(this.promiseState === 'fulfilled') {
      onFulfilled(this.promiseResult);
    } else if(this.promiseState === 'rejected') {
      onRejected(this.promiseResult);
    } else if(this.promiseState === 'pending') {
      this.onFulfilledCallbacks.push(onFulfilled.bind(this));
      this.onRejectedCallbacks.push(onRejected.bind(this));
    }
  }

}
// TODO: 状态可以改变
const test1 = new Promise2((resolve, reject) => {
  resolve('成功')
  reject('失败')
})
console.log(test1) // MyPromise { PromiseState: 'rejected', PromiseResult: '失败' }

// TODO: promise里面有异步情况，需要把结果值保存起来
const test2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('失败');
  }, 1000);
}).then((res) => console.log(res), err => console.log('err', err));

console.log(test2)