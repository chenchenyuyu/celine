// 1. 字符串的替换空格问题
// 请实现一个函数，将一个字符串中的每个空格替换成“%20”。
// 例如，当字符串为We Are Happy。则经过替换之后的字符串为We%20Are%20Happy。

const replaceSpace = (string) => {
  if(typeof string !== 'string') throw Error('only support string');
  return string.split(' ').join('%20');
}

const replaceSpace1 = (string) => {
  return string.replace(/\s/g,'%20');
  // return string.replace(/\s+/g,'%20'); //连续多个空格
}

