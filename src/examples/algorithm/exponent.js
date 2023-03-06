// 数字的次方
// exponent 是正，负，0的情况
// base为0的情况。

const computeEx = (base, ex) => {
  if(!base) return 0;
  if(!ex) return 1;

  let result = 1;
  for(let i = 0; i < Math.abs(ex); ex++) {
    return result *= base;
  }
  return ex > 0 ? result : 1/result;
}


