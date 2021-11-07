import React, { Component } from "react";
import { RouterContext } from "../RouterContext";
import matchPath from "../matchPath";

// Switch 核心
// 1. 只将与当前url中相匹配的Route 进行实例化，（在没有Switch进行包裹的时候所有Route组件都进行了实例化）
// 2. 如果Switch 中传递了location 这个props 那无论路由如何变换 都只是渲染这个 location对应的组件  {/* <Switch location={{ pathname: "/reduxPage" }}> */}
class Switch extends Component {
  render() {
    return (
      <RouterContext.Consumer>
        {(context) => {
          // todo read
          const location = context.location;
          console.log("=== this.props.location ====", this.props.location);
          let element, match = null;
          const { children } = this.props;
          let defaultPage = null;
          React.Children.forEach(children, (child) => {
            // match == null 是进行唯一匹配的关键，匹配成功后就不需要继续走到下面的逻辑中去了。
            if (match == null && React.isValidElement(child)) {
              element = child;
              // Route path props项的获取  <Route exact path="/home" component={HomePage} />
              const path = child.props.path;
              match = path
                ? matchPath(location.pathname, {
                  ...child.props,
                  path,
                })
                : context.match;
              //没有匹配到 就使用 未设置 path 的Route 组件进行展示
              defaultPage = !child.props.path && child
            }
          });
          // 是否匹配到了当前路由对应的组件，如果没有匹配成功的话就展示默认页面
          return match
            ? React.cloneElement(element, {
              location,//保证了自组件可以访问 this.props.location
              computedMatch: match,
            })
            : defaultPage
              ? React.cloneElement(defaultPage, {
                location,
                computedMatch: match,
              })
              : null
        }}
      </RouterContext.Consumer>
    );
  }
}

export default Switch;
