import React, { useState, useRef, useEffect } from 'react';
// TODO: setState与useState是同步执行，还是异步执行问题
// TODO: 源代码 packages/react-reconciler/src/ReactFiberHooks.new.js
// https://juejin.cn/post/6959885030063603743
const style = {
  width: '100%',
  height: '30px',
  borderBottom: '1px solid #000',
  paddingBottom: '10px',
};

const Hook = () => {
  const [state, setState] = useState(0);
  const [a, setA] = useState(0)
  const [b, setB] = useState(0)
  const [num, setNum] =  useCustomState(0);
  const [a3, setA3] = useState(0); 

  const handleClick = () => {
    // 代码同步执行
    // render 了两次(第一次render和第二次state的更新)，state合并更新，最后值2
    setState(state + 1);
    setState(state + 1);
    setState(state + 2);
    setState(state + 2);
  }

  const addTwice1 = () => {
    // render 了两次(第一次render和第二次state的更新)，a=2
    setA(a => a + 1) // 1
    setA(a => a + 1) // 2
    console.log('a', a) // 0
  }
  
    const addTwice2 = () => {
     // render 了两次(第一次render和第二次state的更新) b=1
      setB(b + 1)
      setB(b + 1) // 1
    }
    // 在3秒内，立即触发5次，a3是多少？
    // 1
    const addTwice3 = () => {
      setTimeout(() => {
        setA3(a3 + 1)
      }, 1000)
    }

    const addNumCustom = () => {
      setNum(num + 1, (res) => {
        console.log('faith=============', res)
      })
    }
  console.log('render')

  return(
    <div style={{width: '100px', height: '100%', background: 'pink'}}>
      <div style={style} onClick={() => handleClick()}>{state}</div>
      <div style={style} onClick={addTwice1}>state是参数a: {a}</div>
      <div style={style} onClick={addTwice2}>state直接运算: {b}</div>
      <div style={style} onClick={addNumCustom}>模拟useState: {num}</div>
      <div style={style} onClick={addTwice3}>state直接setTimeout{a3}</div>
    </div>
  );
}

// 模拟useState，传入第二个函数传回的参数，始终是state的最新值
const useCustomState = (initState) => {
  const [num, setNum] = useState(initState);
  const cbRef = useRef();

  const setState = (state, cb) => {
    setNum(state);
    cbRef.current = cb;
  }

  useEffect(() => {
    typeof cbRef.current === 'function' && cbRef.current(num);
    cbRef.current = null;
  }, [num, setState]);

  return [num, setState];
}


export default Hook;
