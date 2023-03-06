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
  if(stack2.lengh === 0) {
    while(stack1.length > 0) { // 将stack1里面的数据给stack2
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