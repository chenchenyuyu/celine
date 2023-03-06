// 求1+2+3+...+n，
// 要求不能使用乘除法、for、while、if、else、switch、case等关键字及条件判断语句（A?B:C）。

// 使用递归，使用&&短路来终止递归

function sum(n) {
  return n && (n + sum(n - 1));
}

console.log(sum(5));