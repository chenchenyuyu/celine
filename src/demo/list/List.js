// 链表节点的定义
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

// 1. 插入操作
// 在头部插入
function insertAtHead(head, val) {
  const newNode = new ListNode(val); // 值
  newNode.next = head; // 指针
  return newNode;
}

// 在尾部插入指针
function insertAtTail(head, val) {
  const newNode = new ListNode(val); // 值
  let current = head;
  while (current.next) { // 循环找到最后一个节点
    current = current.next;
  }
  current.next = newNode; // 指针
}

// 在指定位置插入指针
function insertAtIndex(head, val, index) {
  const newNode = new ListNode(val); // 值
  let current = head;
  let i = 0;
  while (i < index - 1 && current.next) { // 循环找到指定位置的前一个节点
    current = current.next;
    i++;
  }
  newNode.next = current.next; // 指针
  current.next = newNode; // 指针
}

// 2. 删除操作

// 删除头部节点
function deleteHead(head) {
  if (!head) return null;
  return head.next;
}

// 删除尾部节点
function deleteTail(head) {
  if (!head || !head.next) return null;
  
  let current = head;
  while (current.next && current.next.next) {
    current = current.next; // 循环到倒数第二个节点
  }
  current.next = null; // 清除最后一个节点的指针上的引用
  return head;
}

// 删除指定值的节点
function deleteNode(head, val) {
  if (!head) return null;
  
  // 如果要删除的是头节点
  if (head.val === val) return head.next;
  
  let current = head;
  while (current.next && current.next.val !== val) { // 循环找到指定值的前一个节点
    current = current.next;
  }
  
  if (current.next) {
    current.next = current.next.next; // 清除指定节点的指针上的引用， 指向指定节点的下一个节点
  }
  return head;
}

// 3. 查找到摸一个具体节点

// 查找指定值的节点
function findNode(head, val) {
  let current = head;
  while (current) {
    if (current.val === val) return current; // 找到指定值的节点
    current = current.next; // 循环遍历链表， 将指针指向当前节点的下一个节点
  }
  return null;
}

// 查找指定索引的节点
function findNodeAtIndex(head, index) {
  let current = head;
  let i = 0;
  while (i < index && current.next) { // 循环找到指定索引的节点
    current = current.next;
    i++;
  }
  return current; // 返回指定索引的节点
}

// 4. 遍历链表
function traverseList(head) {
  let current = head;
  while (current) { // 循环遍历链表， 直到当前节点为空， 如果当前节点为空， 则遍历结束
    console.log(current.val); // 打印当前节点的值
    current = current.next; // 将指针指向当前节点的下一个节点
  }
}

// 链表转数组
function linkedListToArray(head) {
  const result = [];
  let current = head;
  
  while (current) {
    result.push(current.val); // 获取当前节点的值 插入到数组
    current = current.next;
  }
  return result;
}

// 数组转链表
function arrayToLinkedList(arr) {
  if (!arr.length) return null;
  
  let head = new ListNode(arr[0]); // 创建头节点
  let current = head;
  
  for (let i = 1; i < arr.length; i++) {
    current.next = new ListNode(arr[i]); // 创建节点数据值
    current = current.next; // 将指针指向当前节点的下一个节点
  }
  
  return head;
}

// 反转链表
function reverseList(head) {
  let prev = null;
  let current = head;
  
  while (current) { // 替换链表数据
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  
  return prev;
}

// 检测环（快慢指针）
function hasCycle(head) {
  if (!head || !head.next) return false;
  
  let slow = head;
  let fast = head;
  
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    
    if (slow === fast) return true; // 快指针追上慢指针， 说明有环， 两个指针的值相等
  }
  
  return false;
}

// 找到环的起点
function detectCycle(head) {
  if (!head || !head.next) return null;
  
  let slow = head;
  let fast = head;
  
  // 第一阶段：判断是否有环
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    
    if (slow === fast) break;
  }
  
  // 如果没有环
  if (!fast || !fast.next) return null;
  
  // 第二阶段：找到环的起点
  slow = head;
  while (slow !== fast) {
    slow = slow.next;
    fast = fast.next;
  }
  
  return slow;
}

// 合并两个有序链表
function mergeTwoLists(l1, l2) {
  const dummy = new ListNode(0);
  let current = dummy;
  
  while (l1 && l2) {
    if (l1.val <= l2.val) { // 比较两个链表当前节点的值， 将较小的值插入到新链表中
      current.next = l1;
      l1 = l1.next;
    } else { // 否则将较大的值插入到新链表中
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }
  
  current.next = l1 || l2;
  return dummy.next;
}

// 找到中间节点
function findMiddle(head) {
  let slow = head;
  let fast = head;
  
  while (fast && fast.next) { // 快指针每次走两步， 慢指针每次走一步， 当快指针到达链表末尾时， 慢指针指向的节点就是中间节点
    slow = slow.next;
    fast = fast.next.next;
  }
  
  return slow;
}

