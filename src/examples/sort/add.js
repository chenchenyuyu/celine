// 实现一个add函数
// add(1)(2)(3).equal() 输出6
// add(1)(2)(3)(4).equal() 输出10

// 1. 参数不定， 链式调用
// 2. 最后输出add().equal();
// const add = (...a) => { // 可实现三层函数的不定参数调用
//   const fn = (...b) => {
//     return add([...a, ...b]);
//   }

//   fn.valueOf = (...arg) => {
//     return arg.reduce((a, b) => a+b,0);
//   }
//   return fn
// };

// console.log(+add(1, 2)(2, 3)(3));
// function curry(fn) {
//   var slice = [].slice;
//   var len = fn.length;
//   console.log('fn.length', len)
//   return function curried() {
//       var args = slice.call(arguments);
//       if (args.length >= len) {
//           return fn.apply(null, args);
//       }

//       return function () {
//           return curried.apply(null, args.concat(slice.call(arguments)));
//       };
//   };
// }
// function curry1(fn, ...args) {
//   return fn.length <= args.length ? fn(...args) : curry1.bind(null, fn, ...args);
// }

// var add = curry(function (a, b) {
//   return a+b;
// });

function add() {
  const _args = [...arguments] // 3、我怎么知道add没有参数了呢？先要收集参数吧,收集第一次的参数
  function fn(...args1) { // 1、函数要返回一个函数(我是否可以先声明一个函数，然后返回)
    _args.push(...arguments) // 3、收集第二次的参数
    return fn // 4、还要在函数fn内部返回fn(这里可能会想这个会不会死循环，答案是不会，因为返回的是fn而不是让fn()执行)
  }
  fn.equal = function() {
    return _args.reduce((acc, cur) => acc + cur);
  }
  return fn // 1、函数要返回一个函数(我是否可以先声明一个函数，然后返回)
}
console.log(add(1)(2)(3)(4).equal())
console.log(add(1)(1, 2, 3)(2).equal())


/**
 * 将函数柯里化
 * @param fn    待柯里化的原函数
 * @param len   所需的参数个数，默认为原函数的形参个数
 */
function curry(fn,len = fn.length) {
  return _curry.call(this,fn,len)
}

/**
* 中转函数
* @param fn    待柯里化的原函数
* @param len   所需的参数个数
* @param args  已接收的参数列表
*/
function _curry(fn,len,...args) {
  return function (...params) {
      let _args = [...args,...params];
      if(_args.length >= len){
          return fn.apply(this,_args);
      }else{
          return _curry.call(this,fn,len,..._args)
      }
  }
}
