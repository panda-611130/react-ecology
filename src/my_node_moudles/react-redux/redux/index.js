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
    //store 是“无知的”怎样修改数据是renducer这个“管家”拿着“账本”进行计算的
    currentState = reducer(currentState, action);
    // 发布给订阅者 执行订阅者订阅时候传递过来的回调函数
    currentListeners.forEach((listener) => {
      listener();
    });
  };
  //调用了 store。subscribe 的组件相当于把自己添加到了更新队列
  /**
   * @param {*} listener 定义的回调函数，
   */
  const subscribe = (listener) => {
    currentListeners.push(listener);
    //返回注销函数
    return ()=>{
      const index = currentListeners.indexOf(listener);
      currentListeners.splice(index,1);
    }
  };

  //初始化初始值
  dispatch({ type: "@INIT/REDUX" });
  return {
    getState,
    dispatch,
    subscribe,
  };
}

/**
 * 中间件的核心:将 dispatch 函数进行升级
 * @param  {...any} middlewareas 中间件 数组结构,内部元素是各个中间件钩子函数
 * retutn
 * 
 */
export function applyMiddleware(...middlewareas) {
  return (createStore) => (...reducer) => {
    const store = createStore(...reducer);
    let dispatch = store.dispatch;
    const middleApi = {
      getState: store.getState,
      dispatch:(action) => dispatch(action)
    };
    //返回的还是一个函数数组 也就是各个中间件执行后renturn 回来的第一层函数
    const middlewaresChian = middlewareas.map((middleware) =>
      middleware(middleApi)
    );

    dispatch = compose(...middlewaresChian)(dispatch);

    //核心对 dispatch 进行升级重写
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
  };

  const composeFunc = funcs.reduce((preFunc, currFunc) => {
    return (...args) =>
      preFunc(currFunc(...args))
  }
  );
  return composeFunc;
}
