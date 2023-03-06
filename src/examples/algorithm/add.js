// 不用加法，实加数字

// 1.不进位相加 num1 ^ num2
// 2.计算进位 (num1 & num2) << 1
// 3.进位与不进位结果进行相加
// 重复这三步，直到进位值为0

// https://www.conardli.top/docs/algorithm/%E6%95%B0%E5%AD%A6%E8%BF%90%E7%AE%97/%E4%B8%8D%E7%94%A8%E5%8A%A0%E5%87%8F%E4%B9%98%E9%99%A4%E5%81%9A%E5%8A%A0%E6%B3%95.html
// 递归
function Add(num1, num2) {
  if (num2 === 0) {
    return num1;
  }

  return Add(num1 ^ num2, (num1 & num2) << 1);
}


// 非递归

function Add(num1, num2) {
  while (num2 != 0) {
    const excl = num1 ^ num2;
    const carry = (num1 & num2) << 1;
    num1 = excl;
    num2 = carry;
  }
  return num1;
}