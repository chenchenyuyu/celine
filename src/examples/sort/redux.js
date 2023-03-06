function createStore () {
  let state;
  let listeners = [];


  function getState(){
    return state;
  }

  function dispatch() {
    state = reducer(state, action);// 新state
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  }

  function subscribe(callback) {
     // subscribe就是将回调保存下来
     listeners.push(callback); 
  }

  const store = {
    getState,
    dispatch,
    subscribe,
  }

  return store
}