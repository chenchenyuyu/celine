// instanceof
// instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。
// a instance b 检测b.prototype是否在a的原型链上面

function instanceof2(leftParam, rightParam) {
  let proto = Object.getPrototypeOf(leftParam);
  let prototype = rightParam.prototype;

  while(true) { // 循环查询leftParam的原型
    if(!proto) return false;
    if(proto === prototype) return true;
    prototype = Object.getPrototypeOf(proto);
  }
}