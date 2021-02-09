/**
 *
 * @param {*} reducer
 * @param {*} enhancer 中间件，实际是applyMiddleware 执行后的结果
 */
export function createStore(reducer, enhancer) {
  if (enhancer) {
    return enhancer(createStore)(reducer);
  }
  let currentState = undefined;
  let currentListeners = [];
  const getState = () => {
    return currentState;
  };

  const dispatch = (action) => {
    currentState = reducer(currentState, action);
    currentListeners.forEach((listener) => {
      listener();
    });
  };

  const subscribe = (listener) => {
    currentListeners.push(listener);
  };

  dispatch({ type: "@INIT/REDUX-KKB" });

  return {
    getState,
    dispatch,
    subscribe,
  };
}

/**
 * 中间件的核心:将dispatch 函数进行升级
 * @param  {...any} middlewareas 中间件 数组结构
 *
 */
export function applyMiddleware(...middlewareas) {
  return (createStore) => (...reducer) => {
    const store = createStore(...reducer);
    let dispatch = store.dispatch;

    const middleApi = {
      getState: store.getState,
      dispatch,
    };

    const middlewaresChian = middlewareas.map((middleware) =>
      middleware(middleApi)
    );
    dispatch = compose(...middlewaresChian)(dispatch);

    return { ...store, dispatch };
  };
}

/**
 * 将函数串行执行
 * @param  {...any} funcs 函数数组
 */
function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
    // return () => {};
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  const composeFunc = funcs.reduce((preFunc, currFunc) => (...args) =>
    preFunc(currFunc(...args))
  );

  return composeFunc;
}
