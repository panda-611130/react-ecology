import React, { Component } from "react";
import { RouterContext } from "../RouterContext";
import matchPath from "../matchPath";

// Switch 核心
// 1. 只将与当前url中相匹配的Route 进行实例化，（在没有Switch进行包裹的时候所有Route组件都进行了实例化）
// 2. 如果Switch 中传递了location 这个props 那无论路由如何变换 都只是渲染这个 location对应的组件
// 3.
class Switch extends Component {
  render() {
    return (
      <RouterContext.Consumer>
        {(context) => {
          const location = this.props.location || context.location;
          let element,
            match = null;
          const { children } = this.props;
          React.Children.forEach(children, (child) => {
            if (match == null && React.isValidElement(child)) {
              element = child;
              //Route 组件自身path 获取
              const path = child.props.path;
              match = path
                ? matchPath(location.pathname, {
                    ...child.props,
                    path,
                  })
                : context.match;
            }
          });

          return match
            ? React.cloneElement(element, {
                location,
                computedMatch: match,
              })
            : null;
        }}
      </RouterContext.Consumer>
    );
  }
}

export default Switch;
