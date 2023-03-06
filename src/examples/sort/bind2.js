
var obj = {
  value: 1,
};
var fun = function () {
  console.log(this.value);
}

// fun.call(obj); // 让fun可以访问obj
Function.prototype.call2 = function(obj, ...args) {
  const context = obj || window;
  context.fn = this; // 把当前函数绑定到obj上面
  context.fn(...args); // 直接执行
  delete context.fn;
}

// 直接执行
// 参数是数组
Function.prototype.apply2 = function (context, args) {
  context.fn = this;
  context.fn(args);
  delete context.fn;
}
