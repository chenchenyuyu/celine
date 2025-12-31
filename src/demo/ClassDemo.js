class Parent {
  constructor(name) {
    this.name = name; // 实例属性
  }

  // 原型方法（自动挂载到 Parent.prototype）
  sayName() {
    console.log(`姓名：${this.name}`);
  }

  // 静态方法（自动挂载到 Parent 本身）
  static staticMethod() {
    console.log('父类静态方法');
  }
}

// 继承父类
// 使用super和extends关键字实现继承

class Child extends Parent { 
  constructor(name, age) {
    super(name); // 调用父构造函数（必须先调用 super）
    this.age = age;
  }

  // 子原型方法
  sayAge() {
    console.log(`年龄：${this.age}`);
  }

  // 私有方法（ES6+ 原生支持）
  #privateMethod() {
    console.log('私有方法，外部不可访问');
  }

  callPrivate() {
    this.#privateMethod(); // 类内部可访问
  }
}

// 测试
const child = new Child('Tom', 18);
child.sayName(); // 姓名：Tom
child.sayAge(); // 年龄：18
Child.staticMethod(); // 父类静态方法（自动继承）
child.callPrivate(); // 私有方法，外部不可访问
// child.#privateMethod(); // 报错：私有成员不可外部访问
console.log(child.constructor === Child); // true（自动修正）