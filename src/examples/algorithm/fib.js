// 大家都知道斐波那契数列，现在要求输入一个整数n，请你输出斐波那契数列的第n项（从0开始，第0项为0）。
// f(n) = f(n-1) + f(n-2)

const fib = (n) => {
  if(n < 2) {
    return n;
  }
  return fib(n-1)+fib(n-2);
}

const fib2 = (n, memory = []) => {
  if(n < 2) {
    return n;
  }

  if(!memory[n]) {
    return memory[n] = fib2(n-1, memory) + fib2(n-2, memory);
  }
  return memory[n]; // 计算过的值不需要再计算
}

// 一只青蛙一次可以跳上1级台阶，也可以跳上2级……它也可以跳上n级。求该青蛙跳上一个n级的台阶总共有多少种跳法。
// 每个台阶都可以选择跳或者不跳，最后一个台阶必跳。
// 每个台阶有两种选择，n个台阶有2的n次方种选择。
// 所以一共有2的n-1次跳法。

// Math.pow(2, n-1);