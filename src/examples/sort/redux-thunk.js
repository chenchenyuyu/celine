// dispatch async
// 1. action 返回对象
// 2. thunk 需要处理返回函数，并且传递{dispatch, getState} = store;
// 百行代码，千行文档，思想惊人

const ADD = (state) => {
  return {
    type: 'ADD_DATA',
    state,
  }
}

store.dispatch(ADD());

const fetchData = (store) => {
    setTimeout(() => {
      store.dispatch(ADD());
    },5000);
}

function createThunkMiddleware (params) {
  return ({ dispatch, getState }) => (next) => (action) => {
    if(typeof action === 'function') {
      return action(dispatch, getState, params);
    }

    return next(action);
  }
}

const thunk = createThunkMiddleware();

thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
