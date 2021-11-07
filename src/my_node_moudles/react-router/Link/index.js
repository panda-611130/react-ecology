import React, { Component } from "react";
import { RouterContext } from "../RouterContext";

//  核心
// 1. 渲染的结果是个a标签，只不过这个a标签被 preventDefault 截停了
// 2. 做的最核心的一件事就是 调用history.push 从而激活BrowserRouter中对于history的监听函数最终导致其内部的组件进行重新的渲染。
class Link extends Component {
  handleClick = (event, history) => {
    event.preventDefault();
    history.push(this.props.to);
  };
  render() {
    const { to, children, ...rest } = this.props;
    return (
      <RouterContext.Consumer>
        {(value) => (
          <a
            href={to}
            onClick={(e) => {
              this.handleClick(e, value.history);
            }}
            {...rest}
          >
            {children}
          </a>
        )}
      </RouterContext.Consumer>
    );
  }
}

export default Link;
