// 手写Object.create,将传入对象作为原型

function create(obj) {
  function F(){}; // 新创建空函数
  F.prototype = obj; // 空函数原型指向对象
  return new F(); // 返回函数子对象
}