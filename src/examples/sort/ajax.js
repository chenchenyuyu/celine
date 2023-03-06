// https://juejin.cn/post/6844903618764603399
// ajax axios fetch
function ajax(options){
  const xhr = new XMLHttpRequest();
  //初始化参数
  options = options || {};
  options.type = options.dataType || 'json';
  const params = options.data;
  // 发送请求
  if(options.type === 'GET') {
    xhr.open('GET', options.url+ '?' + params, true);
    xhr.send();
  } else if(options.type === 'POST'){
    xhr.open('POST', options.url, true);
    xhr.send(params);
  }
  // 接收请求
  xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
      const { status } = xhr;
      if(status >= 200 && status < 300) {
        options.status && options.success(xhr.responseText, xhr.responseXML);
      } else {
        options.fail && options.fail(status);
      }
    }
  }
}

ajax({
  type: 'post',
  dataType: 'json',
  data: {},
  url: 'http://xxxx',
  success: (data) => {
    console.log('data', data);
  },
  fail: (error) => {
    console.log('error', error);
  }
});