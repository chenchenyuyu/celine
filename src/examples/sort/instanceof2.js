// 一、Object.create

// 1. 创建空函数
// 2. 原型指向
// 3. new 函数
function create(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}

// 二、手写instanceof方法
// o1 instanceof o2 

function instanceof2(o1, o2){
  // o1._proto = o2.prototype
  let o1 = o1._proto_;
  // 循环的写法
  while(true) {
    if(!o1) return false;
    if(o1 === o2.prototype) return true;
    o1 = o1_proto_;
  }
}

// 三、手写new实现
// o1 = new S();

const o1 = {};
o1._proto_ = S.prototype;
S.call(o1);
// return o1;