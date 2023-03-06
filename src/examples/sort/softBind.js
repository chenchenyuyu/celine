// 1. 返回函数
// 2. 传入参数
// 3. bind2返回的函数，如果被new 调用，this丢失
// function.bind(thisArg,arg1,arg2,arg3,...)
Function.prototype.Bind2 = function(obj,...args){
  return (...res) => this.call(obj,...args,...res);
}

// TODO: softBind与bind的区别:
// bind函数多次调用会已第一次绑定的this为准，softbind已最后一次绑定传入的this为准；

Function.prototype.softBind = function(obj, ...rest) {
  const fn = this
  const bound = function(...args) {
    const o = !this || this === (window || global) ? obj : this
    return fn.apply(o, [...rest, ...args])
  }

  bound.prototype = Object.create(fn.prototype);
  return bound;
}

function func(a,b,c){
  console.log(`${this.name},${a},${b},${c}`);
}

var k = {
  name: 'k',
  func: func,
}

var funcS = func.softBind(k,0);
var funcB = func.Bind2(k,0);

funcB(1,2);   // k,0,1,2
funcB.apply({name:'apply'},[2,344]); // k,0,2,344
// 这里apply，没有生效

funcS(1,2);   // k,0,1,2
funcS.apply({name:'apply'},[2,3]); // apply,0,2,3
// 这里则apply生效