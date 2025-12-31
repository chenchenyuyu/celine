// JSON.parse
// 实现json解析函数

const parse = (json) => {
    return eval("("+json+")"); //eval函数
}

// eval提供一个代码执行环境 将传入的字符串当js代码执行