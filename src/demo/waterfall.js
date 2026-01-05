class Waterfall {
  constructor(container, options = {}) {
    this.container = document.querySelector(container);
    this.columns = options.columns || 3; // 列数
    this.gap = options.gap || 16; // 间距
    this.items = [];
    this.columnHeights = new Array(this.columns).fill(0); // 初始化列高度
  }

  // 布局元素
  layout() {
    const containerWidth = this.container.clientWidth;
    const itemWidth = (containerWidth - (this.columns - 1) * this.gap) / this.columns;
    
    this.items.forEach(item => {
      // 找到高度最小的列
      const minHeight = Math.min(...this.columnHeights);
      const minIndex = this.columnHeights.indexOf(minHeight);
      
      // 设置元素位置和宽度
      item.style.width = `${itemWidth}px`;
      item.style.position = 'absolute';
      item.style.left = `${minIndex * (itemWidth + this.gap)}px`;
      item.style.top = `${minHeight}px`;
      
      // 更新列高度
      this.columnHeights[minIndex] += item.offsetHeight + this.gap;
    });
    
    // 设置容器高度
    this.container.style.height = `${Math.max(...this.columnHeights) - this.gap}px`;
  }

  // 添加元素
  addItems(items) {
    items.forEach(item => {
      this.container.appendChild(item);
      this.items.push(item);
    });
    this.layout();
  }
}