import React, { useState, useEffect, useContext } from "react";
import { Context } from "../reduxContext";

export function Provider({ store, children }) {
  return <Context.Provider value={store}>{children}</Context.Provider>;
}

/**
 *
 * @param {*} mapStateToProps
 * @param {*} mapDispatchToProps function|object|null
 */
export const connect = (
  mapStateToProps = (state) => state,
  mapDispatchToProps = {}
) => (Comp) => (props) => {
  const store = useContext(Context);
  //属性代理： 获取store中的最新数据传递给组件
  const getMoreProps = () => {
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
  useEffect(() => {
    store.subscribe(() => {
      setMoreProps({ ...moreProps, ...getMoreProps() });
    });
  }, []);
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
  return (...args) => dispatch(creator(...args));
};
