class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

class Task {
  constructor(id, name, priority = 0) {
    this.id = id;
    this.name = name;
    this.priority = priority; // 优先级，数字越大优先级越高
  }
}

class TaskScheduler {
  constructor() {
    this.head = null;
  }
  
  // 添加任务（按优先级插入）
  addTask(task) {
    const newNode = new ListNode(task);
    
    // 如果链表为空或新任务优先级最高
    if (!this.head || task.priority > this.head.val.priority) {
      newNode.next = this.head;
      this.head = newNode;
      return;
    }
    
    // 找到插入位置
    let current = this.head;
    while (current.next && current.next.val.priority >= task.priority) { // 找到第一个优先级低于新任务的节点
      current = current.next;
    }
    
    newNode.next = current.next;
    current.next = newNode;
  }
  
  // 执行下一个任务
  executeNext() {
    if (!this.head) return null;
    
    const task = this.head.val;
    this.head = this.head.next; // 移除头节点
    return task;
  }
  
  // 查看下一个任务
  peekNext() {
    return this.head ? this.head.val : null;
  }
  
  // 取消任务
  cancelTask(taskId) {
    if (!this.head) return false;
    
    // 如果是头节点
    if (this.head.val.id === taskId) {
      this.head = this.head.next;
      return true;
    }
    
    let current = this.head;
    while (current.next && current.next.val.id !== taskId) {
      current = current.next;
    }
    
    if (current.next) {
      current.next = current.next.next;
      return true;
    }
    
    return false;
  }
  
  // 获取所有任务
  getAllTasks() {
    const tasks = [];
    let current = this.head;
    
    while (current) {
      tasks.push(current.val);
      current = current.next;
    }
    
    return tasks;
  }
}

// 使用示例
const scheduler = new TaskScheduler();
scheduler.addTask(new Task(1, "备份数据库", 5));
scheduler.addTask(new Task(2, "发送报告邮件", 3));
scheduler.addTask(new Task(3, "处理紧急故障", 10));
scheduler.addTask(new Task(4, "更新文档", 2));

console.log("下一个任务:", scheduler.peekNext().name); // "处理紧急故障"
console.log("执行任务:", scheduler.executeNext().name); // "处理紧急故障"
console.log("剩余任务:", scheduler.getAllTasks().map(t => t.name));