// 1.将传入的data数据转化为url字符串形式
// 2.处理url中的回调函数
// 3.创建一个script标签并插入到页面中
// 4.挂载回调函数

const jsonp = (url, data, callback = 'callback') => {
  let dataStr = url.indexOf('?') === -1 ? '? ': '&';
  for(let key in data) {
    dataStr += `${key}=${data[key]}&`;
  }
  dataStr +=`callback=`+ callback;

  let oScript = document.createElement('script');
  oScript.src = url + dataStr;

  document.body.appendChild(oScript);

  return new Promise((resolve,reject)=>{
    window[callback] = (data)=> {
      try{
          resolve(data);
        } catch(e){
          reject(e);
        } finally {
          document.body.removeChild(oScript)// 注意这句代码，OScript移除,细节
        }
    }
  });
}



jsonp('https://photo.sina.cn/aj/index?a=1', {
  page:1,
  cate:'recommend'
}).then( res=>{
  console.log(res,'-------then');
})  
