// 1.debounce函数
// 2.input输入框不断输入，1s有输入，重新计算时间执行,一直输入，直到最后一次执行
// 3. 希望不要每次输入字符都请求数据，直到输入完成才请求数据，使用debounce

function debounce(cb, delay = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      cb(...args);
    }, delay);
  }
}

// 2. mouse move, 调整窗口resize等事件，一直执行，但限制执行的次数
// 期间一直执行，执行次数减少
function throttle(cb, delay = 200) {
  let flag = true; //是否是可执行
  return (...args) => {
    if(!falg) {
      return;
    }
    flag = false;
    let timer = setTimeout(() => {
      cb(...args);
      flag = true;
      clearTimeout(timer);
    }, delay);
  }
}

// 3. 手写类型判断函数
const getType = (value) => {
  if(value === null) return null;
  if(typeof value === 'object') {
    return Object.prototype.toString.call(value).slice(8, -1);
  } else {
    return typeof value; // 判断数据属于什么类型
  }
}

