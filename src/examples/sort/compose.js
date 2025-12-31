const fn1 = (x) => {
    return x + 1;
}

const fn2 = (x) => {
    return x + 2;
}

const fn3 = (x) => {
    return x + 3;
}

const fn4 = (x) => {
    return x + 4;
}

// fn函数连续对一个函数做处理
const a = compose(fn1, fn2, fn4, fn4);
a(1) // 1+1+2+3+4

// compose函数依次对传入的参数执行，函数的连续操作
const compose = (...fns) => {
    if(fns.length === 0) return (args) => args;
    if(fns.length === 1) return fns[0]// 目前函数只有1个 将这个唯一的函数返回
    fns.reduce((pre, cur) => {
        return (args) => {
            return cur(pre(args)); // fn4(fn3(fn2(fn1(args))))函数执行
        }
    });
}