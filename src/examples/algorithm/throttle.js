// 1. throttle节流：无论频次发生多少次，保证函数在单位频次发生
// 使用定时器实现，函数按照一定的频次执行
// 保证函数第一次事件肯定不会触发，最后一次函数肯定触发函数
const throttle = (fn, x) => {
    let timer = null;
    return function(...args){
        if(!timer){ // 开始执行函数
            timer = setTimeout(() => {
             timer = null; // 定时器执行 保证函数的定时器是空
                fn.apply(this, args);
            }, x)
        }
    };
}

//2.使用时间戳的方式实现函数节流的方式
// 第一次事件肯定触发 最后一次函数肯定不会触发
const throttle2 = (fn , x) => {
    let time =0;
    return function(...args){
        if(Date.now() - time > x) {
            time = Date.now;
            fn.apply(this, args);
        }
    };
}

