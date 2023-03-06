// 四、promise是异步操作的解决方案
// https://juejin.cn/post/6994594642280857630
// es6纳入 promiseA+规范
// promise对象是一个构造函数，用来生成promise实例
// 3种状态 pending, fulfilled, rejected
// https://www.bilibili.com/video/BV1zy4y1J7Sf/?spm_id_from=333.999.0.0&vd_source=12126ada90fe6d52176d1d2a64e4343f
// 1. 首先是用法
const promise = new Promise(function(resolve, reject){
  // ...some code 
  if(/*异步操作成功*/) {
    resolve(value);
  } else {
    reject(error);
  }
});

// 2. then: 接受resolve和reject的回调函数
promise.then(function(value){
  // 成功
}, function(error){
 // 失败
});

// 3.实际应用
const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`load ${url} fail`));
    image.src = url;
  });
}

// 手写ajax操纵
const getJSON = (url, method, params) => {
  return new Promise((resolve, reject)=> {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4) {
        if(xhr.status === 200){
          resolve(xhr.responseText);
        } else {
          reject(xhr.status);
        }
      }
    }
    xhr.responseType = "json";
    xhr.setRequestHeader("Accept", "application/json");
    xhr.send();
  });
}

// promise的执行
// pending -> fulfiled
// pending -> rejected

let p1 = new Promise((resolve, reject) => {
  resolve('成功');
  reject('失败');
});

let p2 = new Promise((resolve, reject) => {
  reject('失败')
  resolve('成功')
})

let p3 = new Promise((resolve, reject) => {
  throw('报错')
})


class MyPromise {
  constructor(func) {
    // 初始值
    // this.initValue();
    this.PromiseState = 'pending';// 状态
    this.PromiseResult = null; //最终值
    // pending -> fulfiled
    // pending -> rejected
    //绑定函数
    // this.initBind();
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);

    // 保存定时器的回调
    this.onFulfilledCallbacks = []; // 保存成功回调
    this.onRejectedCallbacks = []; // 保存失败的回调

    // 执行函数
    try {
      func(this.resolve, this.reject);
    } catch(error) {
      this.reject(error);
    }
  }

    resolve(value) {
      if(this.PromiseState !== 'pending') return;
      this.PromiseState = 'fulfilled';
      this.PromiseResult = value;
      // 执行队列先进先出
      while(this.onFulfilledCallbacks.length) {
        this.onFulfilledCallbacks.shift()(this.PromiseState)
      }
    }

    reject(error) {
      if(this.PromiseState !== 'pending') return;
      this.PromiseState = 'rejected';
      this.PromiseResult = error;
      while(this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(this.PromiseState);
      }
    }

    // 1. 需要处理有定时器的情况, 数组队列存储数据
    // 2. TODO: then形成链式调用
    then(onFulfilled, onRejected) {
      //onFulfilled = typeof onFulfilled === 'function' ? onFulfilled
      if(this.PromiseState === 'fulfilled') {
        onFulfilled(this.PromiseResult);
      } else if (this.PromiseState === 'rejected') {
        onRejected(this.PromiseResult);
      } else if(this.PromiseState === 'pending') { //表示定时器没有执行完
        this.onFulfilledCallbacks.push(onFulfilled.bind(this));
        this.onRejectedCallbacks.push(onRejected.bind(this));
      }
    }

  static all(promises) {
    const result = [];
    let count = 0;
    return new MyPromise((resolve, reject) => {
      const addData = (index, value) => {
        result[index] = value;
        count ++
        if(count === promise.length) resolve(result); 
      }
      promises.forEach((promise, index) => {
        if(promise instanceof MyPromise) {
          promise.then(res => {
            addData(index, res);
          }, err => reject(err));
        }
      });
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
        promises.forEach(promise => {
            if (promise instanceof MyPromise) {
                promise.then(res => {
                  resolve(res)
                }, err => {
                  reject(err)
                })
            } else {
              resolve(promise)
            }
        })
    })
  }
}

// 360面试

const p = new Promise((resolve) => { 
  console.log(1)
  resolve(2)
  resolve(3)
  console.log(4)
}).then(console.log)
// 1 4 2