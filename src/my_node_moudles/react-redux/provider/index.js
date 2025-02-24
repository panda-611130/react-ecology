import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import { Context } from "../reduxContext";

export function Provider({ store, children }) {
  return <Context.Provider
    value={store}>
    {children}
  </Context.Provider>;
}
/**
 * @param {*} mapStateToProps
 * @param {*} mapDispatchToProps function|object|null
 * return  返回一个funtion 高阶组件
 */
export const connect = (
  mapStateToProps = (state) => state,//默认值
  mapDispatchToProps = {}
) => (Comp) =>
    // 返回的组件
    (props) => {
      const store = useContext(Context);
      //属性代理： 获取store中的最新数据传递给组件
      const getMoreProps = () => {
        // 将 mapStateToProps 函数执行可以 ‘套取出’，执行 mapStateToProps 获取的是我们
        const stateProps = mapStateToProps(store.getState());
        let dispatchProps = {};
        const { dispatch } = store;
        if (typeof mapDispatchToProps === "object") {
          // 参数形式1:对象，对象键（我们暂且命名为 dispathDosomeActionKey ）对应的值是个函数，
          //         调用这个函数（我们暂且命名为 createActionFunc ）只是返回了一个 action ={ type: "****", value: "*****" }
          //         我们需要对这个createActionFunc进行升级 确保在组建中调用dispathDosomeFunc 相当于调用了 dispatch({ type: "****", value: "*****" })
          dispatchProps = bindActionCreaters(mapDispatchToProps, dispatch);
        } else if (typeof mapDispatchToProps === "function") {
          //如果是个函数的形式我们只需要执行 mapDispatchToProps 这个函数
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
      // 同步执行订阅以及
      useLayoutEffect(() => {
        store.subscribe(() => {
          setMoreProps({ ...moreProps, ...getMoreProps() });
        });
      }, []);
      // 属性代理
      return <Comp {...props} {...moreProps} />;
    };

//核心   (...args)=>dispth({action:"....".payload:"..."})
/**
 * @param {*} actionCreators   {add: () => ({ type: "add" }),minus: () => ({ type: "minus" }), },
 * @param {*} dispatch  store 中的dispatch函数
 * 最终返回 
 * {
 *  add: (...arg) => (dispatch({ type: "add" })),
 * }
 */
const bindActionCreaters = (actionCreators, dispatch) => {
  let obj = {};
  for (const actionkey in actionCreators) {
    if (Object.hasOwnProperty.call(actionCreators, actionkey)) {
      //   如上面的要求 我们需要形成 { dispathDosomeActionKey:()=>dispatch({})   }
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



//
function useForceUpdate() {
  // const [state, setState] = useState(0);
  const [, setState] = useReducer((x) => x + 1, 0);

  const update = useCallback(() => {
    // setState((prev) => prev + 1);
    setState();
  }, []);

  return update;
}

// 模拟useDispatch + useSelector
export function useDispatch() {
  const store = useContext(Context);
  return store.dispatch
}



export function useSelector(selecor) {
  const store = useContext(Context);
  const selectedState = selecor(store.getState());

  const forceUpdate = useForceUpdate();

  useLayoutEffect(() => {
    const unsubscribe = store.subscribe(() => {
      // forceUpdate
      forceUpdate();
    });
    return () => {
      unsubscribe();
    };
  }, [store]);

  return selectedState;
}

