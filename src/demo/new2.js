function Super(){};
var s = new Super();

var s = {};
s._proto_ = Super.prototype;
Super.call(s);

//1.创建新空对象
const obj = {};
// 2. 创建构造函数，将空对象的原型对象指向构造函数的原型对象，实现继承关系

function SubSuper(name, age){
  this.name = name;
  this.age = age;
}; //新的子函数

obj._proto_ = SubSuper.prototype;
// 3. 实现obj新对象继承SubSuper的属性和方法 
SubSuper.call(obj);
