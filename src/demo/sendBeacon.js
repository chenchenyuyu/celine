// 简化的polyfill核心逻辑
if (!navigator.sendBeacon) {
  navigator.sendBeacon = function(url, data) {
    const xhr = new XMLHttpRequest();
    
    // 同步XHR实现（不推荐，仅作fallback）
    try {
      xhr.open('POST', url, false); // 同步！
      xhr.setRequestHeader('Content-Type', 
        data instanceof Blob ? data.type : 'text/plain');
      
      // 尝试发送
      xhr.send(data);
      return true;
    } catch (e) {
      // 降级方案：使用Image beacon
      if (typeof data === 'string') {
        const img = new Image();
        img.src = url + '?' + encodeURIComponent(data);
        return true;
      }
      return false;
    }
  };
}