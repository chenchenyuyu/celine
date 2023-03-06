// const version = ['0.1.1', '2.3.3', '0.302.1', '4.2', '4.3.5', '4.3.4.5'];

const a = ['0.1.1', '2.3.3', '0.302.1', '4.2', '4.3.5', '4.3.4.5'].sort((a, b) => {
  let i = 0;
  const arr1 = a.split('.');
  const arr2 = b.split('.');
  console.log('arr1', arr1);
  console.log('arr2', arr2);
  // ['0', '1', '1'] ['2', '3', '3']
  while(true) {
    const s1 = arr1[i]; // 从第一位开始比较
    const s2 = arr2[i];
    console.log('s1',s1)
    console.log('s2', s2)
    i++;
    if(s1 === undefined || s2 === undefined) {// 可能某一位不存在
      return arr2.length - arr1.length; // 降序排列
    }
    if(s1 === s2) continue; //相等，则执行下一位
    return s2 - s1;// 降序排列
  }
});

console.log(a)


//版本号比较
export const versionStringCompare = (preVersion='', lastVersion='') => {
  var sources = preVersion.split('.');
  var dests = lastVersion.split('.');
  var maxL = Math.max(sources.length, dests.length);
  var result = 0;
  for (let i = 0; i < maxL; i++) {  
      let preValue = sources.length>i ? sources[i]:0;
      let preNum = isNaN(Number(preValue)) ? preValue.charCodeAt() : Number(preValue);
      let lastValue = dests.length>i ? dests[i]:0;
      let lastNum =  isNaN(Number(lastValue)) ? lastValue.charCodeAt() : Number(lastValue);
      if (preNum < lastNum) {
          result = -1;
          break;
      } else if (preNum > lastNum) { 
          result = 1;
          break;
      }
  }
  return result;
}
