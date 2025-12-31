const obj = {
    name: '测试',
    age: 22,
    des: '描述测试测试'
}
[['name', '测试'], ['age', 22], ['des', '描述测试测试']]

Object.prototype.entries2 = (obj) => {
    let result = [];
    for(let key in obj) {
        if(obj.hasOwnProperty(key)) {
            result.push([key, obj[key]]);
        }
    }
    return result;
}

Object.prototype.is2 = (x, y) => {
    if(x === y) { // -0 === +0为true
        // 处理-0和+0相等情况
        return x !== 0 || 1/x === 1/y; 
    }
    // 处理NaN与NaN需要相等的情况
    return x !== x && y !== y;
}