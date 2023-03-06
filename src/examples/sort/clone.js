// 1. 实现object的浅拷贝函数

const clone = (target) => {
  const cloneTarget = {};
  for (const key in target) {
    cloneTarget[key] = target[key];
  }

  return cloneTarget;
}

// 2. 实现深拷贝
// 3. 需要判断数据类型
 const target = {
    field1: 1,
    field2: undefined,
    field3: {
        child: 'child'
    },
    field4: [2, 4, 8]
};
target.target = target; // 出现循环应用
//可能出现溢出

const deepClone = (target) => {
  if(typeof target === 'object') {
    let cloneTarget = Array.isArray(target) ? [] : {};
    for (const key in target) {
        cloneTarget[key] = deepClone(target[key]);
    }
    return cloneTarget;
  } else {
    return target;
  }
}

// 解决溢出问题Map
const deepClone1 = (target, map = new WeakMap) => {
  if(typeof target === 'object') {
    let cloneTarget = Array.isArray(target) ? [] : {};
    const mapT = map.get(target);
    if(mapT) {
      return mapT;
    }
    map.set(target, cloneTarget);
    for (const key in target) {
        cloneTarget[key] = deepClone1(target[key], map);
    }
    return cloneTarget;
  } else {
    return target;
  }
}

console.log(deepClone1(target));