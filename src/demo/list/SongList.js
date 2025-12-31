 // 定义链表数据
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

class Song {
  constructor(title, artist, duration) { // 定义歌曲数据，标题、艺术家、时长
    this.title = title;
    this.artist = artist;
    this.duration = duration; // 秒
  }
}

class Playlist { // 定义播放列表数据， 包括头节点、当前节点、尾节点、大小
  constructor() {
    this.head = null;
    this.current = null;
    this.tail = null;
    this.size = 0;
  }
  
  // 添加歌曲到播放列表
  addSong(song) {
    const newNode = new ListNode(song);
    
    if (!this.head) { // 如果播放列表为空，则将新节点设为头节点、尾节点、当前节点
      this.head = newNode;
      this.tail = newNode;
      this.current = newNode;
    } else { // 如果播放列表不为空，则将新节点添加到尾节点的后面
      this.tail.next = newNode;
      this.tail = newNode;
    }
    
    this.size++; // 播放列表大小增加1
    return this;
  }
  
  // 下一首
  next() {
    if (!this.current || !this.current.next) { // 当前歌曲不存在或者不存在下一首，则进行循环播放
      this.current = this.head; // 循环播放
    } else {
      this.current = this.current.next;
    }
    
    return this.current ? this.current.val : null;
  }
  
  // 上一首
  previous() {
    if (!this.current || !this.head) return null; // 当前歌曲不存在或者播放列表为空，则返回null
    
    // 单向链表需要遍历找到前一个节点
    if (this.current === this.head) {
      // 如果是第一首，跳到最后
      let temp = this.head;
      while (temp.next) { // 单向链表 通过循环，找到最后一个节点
        temp = temp.next; 
      }
      this.current = temp;
    } else {
      let temp = this.head;
      while (temp.next !== this.current) { // 单向链表 通过循环，找到当前歌曲的前一个节点
        temp = temp.next;
      }
      this.current = temp;
    }
    
    return this.current.val;
  }
  
  // 随机播放（洗牌）
  shuffle() {
    if (!this.head) return;
    
    // 将链表转为数组
    const nodes = [];
    let current = this.head;
    while (current) {
      nodes.push(current); // 将链表中的数据转换为数组
      current = current.next;
    }
    
    // Fisher-Yates 洗牌算法
    for (let i = nodes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // 随机生成一个索引， 范围是 0 到 i
      [nodes[i], nodes[j]] = [nodes[j], nodes[i]]; // 数组中的元素进行随机交换， 确保每一个元素被随机交换到任意位置，概率相等
    }
    
    // 重新连接链表
    this.head = nodes[0];
    for (let i = 0; i < nodes.length - 1; i++) { // 单向链表 通过循环，将数组中的元素重新连接为链表
      nodes[i].next = nodes[i + 1];
    }
    nodes[nodes.length - 1].next = null;
    this.tail = nodes[nodes.length - 1];
    
    // 如果当前歌曲存在，更新指针
    if (this.current) {
      const currentSong = this.current.val;
      let newCurrent = this.head;
      while (newCurrent && newCurrent.val !== currentSong) { // 单向链表 通过循环，找到当前歌曲的节点
        newCurrent = newCurrent.next;
      }
      this.current = newCurrent;
    }
  }
  
  // 获取播放列表
  getPlaylist() {
    const songs = [];
    let current = this.head;
    
    while (current) {
      songs.push(current.val);
      current = current.next;
    }
    
    return songs;
  }
  
  // 获取当前歌曲
  getCurrentSong() {
    return this.current ? this.current.val : null;
  }
  
  // 获取总时长
  getTotalDuration() {
    let total = 0;
    let current = this.head;
    
    while (current) {
      total += current.val.duration;
      current = current.next;
    }
    
    return total;
  }
}

// 使用示例
const playlist = new Playlist();
playlist
  .addSong(new Song("Bohemian Rhapsody", "Queen", 354))
  .addSong(new Song("Hotel California", "Eagles", 391))
  .addSong(new Song("Stairway to Heaven", "Led Zeppelin", 482));

console.log("当前播放:", playlist.getCurrentSong().title); // "Bohemian Rhapsody"
console.log("下一首:", playlist.next().title); // "Hotel California"
console.log("总时长:", playlist.getTotalDuration(), "秒"); // 1227秒

playlist.shuffle();
console.log("洗牌后播放列表:", playlist.getPlaylist().map(s => s.title)); 
// 随机顺序，如 ["Stairway to Heaven", "Bohemian Rhapsody", "Hotel California"]