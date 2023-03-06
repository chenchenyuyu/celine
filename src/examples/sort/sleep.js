// 使用promise + async await实现异步循环打印

const start = async(n = 10) => {
  for(let i = 0; i < n; i++){
    const r = await sleep(i, 200);
    console.log(r);
  }
}

// const sleep = async(num, delay) => {
//   setTimeout(() => {
//     console.log(num);
//   }, delay);
// }

const sleep = (num, delay) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(num);
      // console.log(num);
    }, delay);
  });
}

console.log(start());