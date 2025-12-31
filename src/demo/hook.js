// ✅ 正确 - 每次渲染调用顺序相同
function Component() {
  const [name, setName] = useState('Alice');    // Hook 1
  const [age, setAge] = useState(25);           // Hook 2
  const [city, setCity] = useState('Beijing');  // Hook 3
  // ...
}

// Hook1 -> Hook2 -> Hook3

// ❌ 错误 - 调用顺序可能变化
function BadComponent() {
  const [name, setName] = useState('Alice');    // Hook 1
  
  if (name === 'Alice') {
    const [age, setAge] = useState(25);         // Hook 2（有时存在，有时不存在）
  }
  
  const [city, setCity] = useState('Beijing');  // Hook 3
  // ...
}

// Hook1 -> Hook3 -> Hook2（条件渲染时） 导致hook获取状态错误
// 需要检查函数实现逻辑 ，确保每次渲染调用顺序相同
//通过检查hook在外层函数调用 ，去除条件调用逻辑