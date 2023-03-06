function Super(){};
var s = new Super();

var s = {};
s._proto_ = Super.prototype;
Super.call(s);