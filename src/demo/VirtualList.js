import React, { useState, useEffect, useRef } from 'react';

const VirtualList = ({ data, itemHeight, height }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const containerRef = useRef(null);
  const visibleCount = Math.ceil(height / itemHeight) + 2; // 可视项数 + 缓冲项
  const totalHeight = data.length * itemHeight; // 总列表高度

  // 监听滚动，计算可视区域索引
  useEffect(() => {
    const container = containerRef.current;
    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const newStart = Math.floor(scrollTop / itemHeight);
      const newEnd = Math.min(newStart + visibleCount, data.length - 1);
      setStartIndex(newStart);
      setEndIndex(newEnd);
    };
    container.addEventListener('scroll', handleScroll);
    // 初始化计算一次
    handleScroll();
    return () => container.removeEventListener('scroll', handleScroll);
  }, [data.length, itemHeight, visibleCount]);

  // 渲染可视区域内的项
  const visibleItems = data.slice(startIndex, endIndex + 1).map((item, idx) => {
    const realIndex = startIndex + idx;
    return (
      <div
        key={realIndex}
        style={{
          position: 'absolute',
          top: `${realIndex * itemHeight}px`, // 绝对定位到正确位置
          width: '100%',
          height: `${itemHeight}px`,
        }}
      >
        {item}
      </div>
    );
  });

  return (
    <div
      ref={containerRef}
      style={{
        height: `${height}px`,
        overflow: 'auto',
        position: 'relative', // 作为子元素绝对定位的容器
      }}
    >
      {/* 占位元素：模拟总列表高度，让滚动条正常显示 */}
      <div style={{ height: `${totalHeight}px` }} />
      {/* 可视区域的列表项 */}
      {visibleItems}
    </div>
  );
};

// 使用示例
const App = () => {
  const bigData = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`);
  return <VirtualList data={bigData} itemHeight={50} height={500} />;
};