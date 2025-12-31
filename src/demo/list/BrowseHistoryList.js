class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

class BrowserHistory {
  constructor(homepage) {
    this.current = new ListNode(homepage);
  }
  
  // 访问新页面
  visit(url) {
    const newNode = new ListNode(url);
    newNode.prev = this.current;
    this.current.next = newNode;
    this.current = newNode;
    return url;
  }
  
  // 后退
  back(steps) {
    let current = this.current;
    let count = 0;
    
    while (current.prev && count < steps) {
      current = current.prev;
      count++;
    }
    
    this.current = current;
    return current.val;
  }
  
  // 前进
  forward(steps) {
    let current = this.current;
    let count = 0;
    
    while (current.next && count < steps) {
      current = current.next;
      count++;
    }
    
    this.current = current;
    return current.val;
  }
  
  // 获取当前页面
  getCurrentPage() {
    return this.current.val;
  }
  
  // 获取所有历史记录
  getHistory() {
    const history = [];
    let current = this.current;
    
    // 向前找历史
    while (current.prev) {
      current = current.prev;
    }
    
    // 向后收集
    while (current) {
      history.push(current.val);
      current = current.next;
    }
    
    return history;
  }
}

// 使用示例
const browser = new BrowserHistory("leetcode.com");
browser.visit("google.com");
browser.visit("facebook.com");
browser.visit("youtube.com");
console.log(browser.back(1)); // "facebook.com"
console.log(browser.back(1)); // "google.com"
console.log(browser.forward(1)); // "facebook.com"
browser.visit("linkedin.com");
console.log(browser.getHistory()); // ["leetcode.com", "google.com", "facebook.com", "linkedin.com"]