// 1. 两个栈实现一个队列, 完成队列的push和pop方法
// 2. 栈的顺序是先进后出
// 3. 实现方式: 一个栈入，另一个栈出
// https://github.com/ConardLi/awesome-coding-js

const stack1 = [];
const stack2 = [];

function push(data) {
  stack1.push(data);
}

function pop() {
  // stack2里面有数据
  if (stack2.lengh === 0) {
    while (stack1.length > 0) { // 将stack1里面的数据给stack2
      stack2.push(stack1.pop());
    }
  }
  return stack2.pop() || null;
}


// 另外的算法，用两个队列实现栈
// 第一步， 入栈值放入 a 队列
// 第二步， 入栈值放入 b 队列， 再把 a 队列的值弹出，按顺序放到 b 队列， 直到 a 队列清空
// 第二步， 入栈值放入 a 队列， 再把 b 队列的值弹出，按顺序放到 a 队列， 直到 b 队列清空
// ... 如此循环
const queue1 = []
const queue2 = []

function push(x) {
  if (queue1.length === 0) {
    queue1.push(x)

    while (queue2.length) {
      queue1.push(queue2.shift())
    }
  } else if (queue2.length === 0) {
    queue2.push(x)

    while (queue1.length) {
      queue2.push(queue1.shift())
    }
  }
};

function pop() {
  if (queue1.length !== 0) {
    return queue1.shift()
  } else {
    return queue2.shift()
  }
};


class Stack {
  constructor() {
    this.result = {}; //{'0': '111', '1': '2233', '2': '7888'}
    this.len = 0; //计数
  }

  push(value) { // 入栈
    this.result[this.len] = value;
    this.len++;
  }

  pop() { //出栈
    if (this.isEmpty) { // 判断是否为空
      return undefined
    }
    let res = this.result[this.len];
    delete this.result[this.len];
    this.len--;
    return res;
  }

  peek() { //查看栈顶元素
    return this.result[this.len];
  }

  empty() { //清除栈内容
    this.result = [];
    this.len = 0;
  }

  isEmpty() {
    return this.len === 0 //判断栈的长度是否为0 
  }

  size() { //返回栈的长度
    return this.len;
  }
  
  toString() { //栈数据转换为字符串
    let str = ``;
    for(let key in this.result) {
      return str += `${this.result[key]}`;// 遍历对象拼接字符串 
    }
  }

}

// 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。
// 有效字符串需满足：
// 左括号必须用相同类型的右括号闭合。
// 左括号必须以正确的顺序闭合。
let isValidFun = function (s) {
  // js中未提供Stack结构，需要自己将上面的Stack实现复制过来。篇幅原因，这里就不复制了
  let stack = new Stack();

  for (let char of s) {
    // 左括号入栈
    if ('({['.includes(char)) {
      stack.push(char)
    } else {
      // 出栈左括号与右括号匹配，如果不匹配或者为空则说明括号无效
      switch (stack.pop()) {
        case '(':
          if (char !== ')') return false;
          break;
        case '{':
          if (char !== '}') return false;
          break;
        case '[':
          if (char !== ']') return false;
          break;
        // 为空
        default: return false;
      }
    }
  }

  // 如果栈为空，则说明所有括号都匹配，返回true，否则返回false
  return !stack.pop()
};

let isstr = isValidFun('({s222}@@@@')
console.log('is', isstr) // 打印数据