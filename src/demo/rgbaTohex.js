// TODO: r, g, b数值转化为16进制颜色值。
// TODO: 颜色值校验，透明度的处理, 待办
// color: 'rgba(0, 1, 0, 0.74)' => #0f0f0d
const rgb2Hex = (color) => {
    let a,
    rgb = color.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
    alpha = ((rgb && rgb[4]) || "").trim(),
    hex = rgb ?
    (rgb[1] | (1 << 8)).toString(16).slice(1) +
    (rgb[2] | (1 << 8)).toString(16).slice(1) +
    (rgb[3] | (1 << 8)).toString(16).slice(1) : color;
    if (alpha !== "") {
        a = alpha;
        } else {
        /*eslint no-octal: "error"*/
        a = "01"; // fix?
        }
    // multiply before convert to HEX
    a = ((a * 255) | (1 << 8)).toString(16).slice(1)
    hex = hex + a;
    return hex;
}

// color: #0f0f0d =>'rgba(0, 1, 0, 0.74)'
const hex2Rgb = (color) => {
    const reg = /[^#]/g; // /[0-9]+/g
    const numArray = color.match(reg);
    let numStr = numArray.join('');

    if(numStr.length === 3) {
        numStr = numStr.split('').reduce((a, v) => (a.concat([v, v])), []).join(''); // 将'123'=>'112233'
        // 另一种实现方式
        // numStr = `${numStr[0]}${numStr[0]}${numStr[1]}${numStr[1]}${numStr[2]}${numStr[2]}`
    }

    let bigint = parseInt(numStr, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    
    return [r, g, b];
}

export {
    rgb2Hex,
    hex2Rgb
};