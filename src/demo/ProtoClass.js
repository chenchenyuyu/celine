// 父构造函数
function Parent(name) {
  this.name = name; // 实例属性
}

// 父原型方法（所有实例共享）
Parent.prototype.sayName = function() {
  console.log(`姓名：${this.name}`);
};

// 静态方法（挂载到构造函数本身）
Parent.staticMethod = function() {
  console.log('父类静态方法');
};

// 子构造函数
function Child(name, age) {
  Parent.call(this, name); // 继承父实例属性
  this.age = age; // 子实例属性 （注意：这里的age是子实例属性，不是父实例属性）
}

// 继承父原型方法（核心：原型链委托）
Child.prototype = Object.create(Parent.prototype); // 子原型指向父原型
// 修正 constructor 指向（否则指向 Parent）
Child.prototype.constructor = Child; // 需要手动修正Child的constructor指向，否则指向Parent

// 子原型方法
Child.prototype.sayAge = function() {
  console.log(`年龄：${this.age}`);
};

// 手动继承静态方法
Child.staticMethod = Parent.staticMethod; // 手动继承父类静态方法

// 测试
const child = new Child('Tom', 18);
child.sayName(); // 姓名：Tom （继承自父类）
child.sayAge(); // 年龄：18 （子实例属性）
Child.staticMethod(); // 父类静态方法 （继承自父类）
console.log(child.constructor === Child); // true（手动修正后）
