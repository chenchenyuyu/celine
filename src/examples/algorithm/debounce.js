// 1.无论事件发生多么频繁，一定在x秒执行函数, 新的函数x秒内发生 不执行
// 定时器， 函数执行
const debounce = (fn, x) => {
    let timer = null;
    return function(...args) {
        clearTimeout(timer); // 先清除定时器
        timer = setTimeout(() => {
            fn.apply(this, args);
        },x);
    }
}
// 应用情况：
// 应用事件, 统计三维视图旋转发生事件
// 1. resize 鼠标拖动计算问题
window.addEventListener('resize', () => {
    // resize事件处理函数
});

// 2. 搜索框输入查询问题
debounce(fetchData(),1000);
// 3. 表单校验工作
debounce(valide(), 1000);


// 有时候需要debounce函数立即执行一次
// 怎么判断是第一次执行，使用flag标志&&timer为空的时候
const debounce2 = (fn, x, flag) => {
    let timer = null;
   return function(...args){
    clearTimeout(timer);
    if(flag && !timer) { // 判断函数是否是第一次执行
        fn.apply(this, args);
    } else {
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, x);
    }
   };
}

