import React, { useState, useEffect, useContext } from "react";
import { Context } from "../reduxContext";

export function Provider({ store, children }) {
  return <Context.Provider
    value={store}>
    {children}
  </Context.Provider>;
}

/**
 *
 * @param {*} mapStateToProps
 * @param {*} mapDispatchToProps function|object|null
 * return  返回一个funtion 高阶组件
 */
export const connect = (
  mapStateToProps = (state) => state,
  mapDispatchToProps = {}
) => (Comp) => (props) => {
  const store = useContext(Context);
  //属性代理： 获取store中的最新数据传递给组件
  const getMoreProps = () => {
    // 将 mapStateToProps 函数执行可以 ‘套取出’
    const stateProps = mapStateToProps(store.getState());
    let dispatchProps = {};
    const { dispatch } = store;
    if (typeof mapDispatchToProps === "object") {
      dispatchProps = bindActionCreaters(mapDispatchToProps, dispatch);
    } else if (typeof mapDispatchToProps === "function") {
      dispatchProps = mapDispatchToProps(dispatch, props);
    } else {
      dispatchProps = { dispatch };
    }
    return {
      ...stateProps,
      ...dispatchProps,
    };
  };

  const [moreProps, setMoreProps] = useState(getMoreProps());
  // 相当于在新组件didMount中进行
  // componentDidMount() {
  //   // 订阅
  //   store.subscribe(() => {
  //     this.forceUpdate();
  //   });
  // }
  useEffect(() => {
    store.subscribe(() => {
      setMoreProps({ ...moreProps, ...getMoreProps() });
    });
  }, []);
  // 属性代理
  return <Comp {...props} {...moreProps} />;
};

//核心   (...args)=>dispth({action:"....".payload:"..."})
/**
 *
 * @param {*} actionCreators   {
 *                                add: () => ({ type: "add" }),
 *                                minus: () => ({ type: "minus" }),
 *                              },
 * @param {*} dispatch  store 中的dispatch函数
 *
 * 
 * 最终返回 
 * {
 *  add: (...arg) => (dispatch({ type: "add" })),
 * }
 */
const bindActionCreaters = (actionCreators, dispatch) => {
  let obj = {};
  for (const actionkey in actionCreators) {
    if (Object.hasOwnProperty.call(actionCreators, actionkey)) {
      obj[actionkey] = bindActionCreater(actionCreators[actionkey], dispatch);
    }
  }
  return obj;
};

/**
 *
 * @param {*} creator 函数  将这个函数执行就可以获取到dispatch 需要的参数{action:"....".payload:"..."}
 * @param {*} dispatch
 */
const bindActionCreater = (creator, dispatch) => {
  //在这个例子中
  return (...args) => dispatch(creator(...args));
};
