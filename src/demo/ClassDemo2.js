// 定义一个 Class 模拟系统
var Class = (function() {
  // 检查是否是有效的构造函数调用
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  
  // 定义属性
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  
  // 创建类
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }
  
  // 实现继承
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    
    // 设置原型继承
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    
    // 设置静态属性继承
    if (superClass) {
      Object.setPrototypeOf 
        ? Object.setPrototypeOf(subClass, superClass)
        : subClass.__proto__ = superClass;
    }
  }
  
  // 调用父类构造函数
  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }
    return _assertThisInitialized(self);
  }
  
  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }
  
  // 获取父类
  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf 
      ? Object.getPrototypeOf 
      : function _getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
        };
    return _getPrototypeOf(o);
  }
  
  // 调用父类方法
  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _getPrototypeOf(target);
        if (!base) return;
        
        var desc = Object.getOwnPropertyDescriptor(base, property);
        if (desc.get) {
          return desc.get.call(receiver);
        }
        return base[property];
      };
    }
    return _get(target, property, receiver || target);
  }
  
  return {
    createClass: _createClass,
    classCallCheck: _classCallCheck,
    inherits: _inherits,
    possibleConstructorReturn: _possibleConstructorReturn,
    getPrototypeOf: _getPrototypeOf,
    get: _get
  };
})();

// 使用 Class 系统
var Animal = (function() {
  function Animal(name) {
    Class.classCallCheck(this, Animal);
    this.name = name;
  }
  
  return Class.createClass(
    Animal,
    [
      {
        key: "speak",
        value: function speak() {
          return this.name + " makes a noise.";
        }
      }
    ],
    [
      {
        key: "type",
        value: function type() {
          return "Animal";
        }
      }
    ]
  );
})();

// 继承示例
var Dog = (function(_Animal) {
  Class.inherits(Dog, _Animal);
  
  function Dog(name, breed) {
    Class.classCallCheck(this, Dog);
    
    var _this = Class.possibleConstructorReturn(
      this,
      Class.getPrototypeOf(Dog).call(this, name)
    );
    
    _this.breed = breed;
    return _this;
  }
  
  return Class.createClass(
    Dog,
    [
      {
        key: "speak",
        value: function speak() {
          return this.name + " barks!";
        }
      },
      {
        key: "getBreed",
        value: function getBreed() {
          return this.breed;
        }
      }
    ]
  );
})(Animal);

// 测试
var dog = new Dog("Buddy", "Golden Retriever");
console.log(dog.speak()); // Buddy barks!
console.log(dog.getBreed()); // Golden Retriever
console.log(Animal.type()); // Animal