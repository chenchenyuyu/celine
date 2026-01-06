/**
 * 通用深比较函数（支持循环引用、基本类型、对象、数组、日期、正则等）
 * @param {any} a 待比较的值1
 * @param {any} b 待比较的值2
 * @param {WeakSet} [visited] 用于处理循环引用的缓存集合
 * @returns {boolean} 两个值是否深层相等
 */
function deepEqual(a, b, visited = new WeakSet()) {
  // 1. 浅比较：基本类型/引用地址相同，直接返回true
  if (Object.is(a, b)) return true;

  // 2. 处理null/undefined（上面Object.is已过滤，这里排除）
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  // 3. 处理循环引用：如果已比较过这对对象，直接返回true（避免无限递归）
  if (visited.has(a) && visited.has(b)) return true;
  visited.add(a);
  visited.add(b);

  // 4. 处理日期对象：对比时间戳
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // 5. 处理正则对象：对比源和标志
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }

  // 6. 处理数组：递归对比每个元素
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i], visited)) return false;
    }
    return true;
  }

  // 7. 处理普通对象（排除数组/日期/正则）：递归对比所有可枚举属性
  if (a.constructor !== b.constructor) return false; // 确保原型一致
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key], visited)) {
      return false;
    }
  }

  return true;
}


const result = deepEqual({a: 1, b: 2}, {a: 1, b: 2}); // true
console.log(result);


function isPlainObject(value) {
    return Object.prototype.toString.call(value).slice(1, -8) === 'object';
}

const deepCompare = (a, b, cacheMap = new WeakMap()) => {
  // 1. 浅比较：基本类型/引用地址相同，直接返回true
  // 基本类型: Undefined, Null, Boolean, Number, String, Symbol
  // 引用类型：Object, Array, Date, RegExp, Function, 自定义对象等

  if (Object.is(a, b)) return true; // Object.is只处理基本类型和引用地址相同的情况

  // 只处理数组和对象格式比较
  // if (Array.isArray(a) !== Array.isArray(b)) return false;
  // if (!isPlainObject(a) || !isPlainObject(b)) return false; // 待修复处理判断数据是否是对象类型

  // 数组
  // const a = [1,2, 4, [1, 5, 6]]
  // const b = [2, 5, 8]
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepCompare(a[i], b[i], cacheMap)) return false;
    }

    return true;
  }
  // 对象
  // const a = { 1: {a1: 2}: 2: {a2: 2}} 
  // const b = { 2: {a2: 2}, 1: {a1: 2}}

  if(isPlainObject(a) && isPlainObject(b)) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    //初步判断对象最外层数据个数是否相同
    if(keysA.length !== keysB.length) return false;
    // 对比每个属性值是否相等
    for (const key of keysA) { // 遍历对象a的所有属性
      if (!keysB.includes(key) || !deepCompare(a[key], b[key], cacheMap)) {
        return false;
      }
    }
    return true;
  }

  // 正则表达式RegExp
  // const a = /[a-z]/g
  // const b = /[a-z]/i
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags; // 对比正则表达式的源和标志
  }
  // source表示正则表达式斜杠中间的字符串部分
  // flags表示正则表达式的标志，如g、i、m等

  // 日期 Date
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime(); // 对比时间戳
  }

}
