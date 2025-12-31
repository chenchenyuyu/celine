// 1. 箭头函数没有属于自身的 this 绑定，
// 2. 它的 this 不是在「调用时」确定的，而是词法作用域（定义时）继承自「外层最近的非箭头函数」的 this；
// 3. 如果外层没有非箭头函数，this 会指向全局对象（浏览器为 window，Node.js 为 globalThis）
// 4. 没法通过call, bind, apply改变箭头函数的this绑定指向
const obj2 = {
    name: '测试22',
   testName () {
    console.log('输出sss1', this.name); 
    const testArrowFun = () => {
      // 箭头函数的this 指向定义时的上下文，而不是调用时的上下文
      console.log('输出sss2', this.name)}; // 实际指向 obj2
      testArrowFun();
    }
}

obj2.testName();
// 输出sss1 测试22
// 输出sss2 测试22


// 示例1：外层有非箭头函数
const obj = {
  name: '张三',
  normalFn() { // 普通函数：this 指向 obj（调用者）
    // 箭头函数：继承外层 normalFn 的 this → obj
    const arrowFn = () => {
      console.log(this.name); // 张三
    };
    arrowFn(); // 无论怎么调用，this 都不变
  }
};
obj.normalFn(); // 输出：张三

// 示例2：外层无非箭头函数（全局作用域）
const globalArrow = () => {
  console.log(this); // 浏览器：window；Node：globalThis
};
globalArrow(); // 全局调用，this 仍指向全局对象