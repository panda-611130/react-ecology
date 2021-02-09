import React, { Component } from "react";
import { RouterContext } from "../RouterContext";
//从react中直接copy过来的
import matchPath from "../matchPath";
//核心:1.route中会按照 chilidren > component >render这种权重决定最终的渲染结果
//    2.即使当前组件的props.path 没有和现有的路由进行匹配但是Route组件中配置的children 也会进行执行
//    3. 为了子组件能够获取到最新的 match 所以在这里重新包裹了一个provider 内部包裹的子组件就可以获取到最新的match数据，如果不包裹的化只能获取到最外层提供的match 但是这个math是个通过静态属性获取到的值
class Route extends Component {
  render() {
    return (
      <RouterContext.Consumer>
        {(context) => {
          const {
            path,
            component,
            children,
            render,
            computedMatch,
          } = this.props;
          const location = this.props.location || context.location;
          //判断当前url 是否和组件自身的path相匹配，
          const match = computedMatch
            ? computedMatch
            : path
            ? matchPath(location.pathname, this.props)
            : context.match;
          const props = {
            ...context,
            location,
            match,
          };

          return (
            <RouterContext.Provider value={props}>
              {match
                ? children //最高优先级
                  ? typeof children === "function"
                    ? children(props)
                    : children
                  : component //优先级第二
                  ? React.createElement(component, props)
                  : render //优先级第三
                  ? render(props)
                  : null
                : typeof children === "function"
                ? children(props)
                : null}
            </RouterContext.Provider>
          );
        }}
      </RouterContext.Consumer>
    );
  }
}
export default Route;
