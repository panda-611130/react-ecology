import React, { Component } from "react";

import { RouterContext } from "../RouterContext";

class Redirect extends Component {
  render() {
    return (
      <RouterContext.Consumer>
        {(context) => {
          const { to } = this.props;
          const { history } = context;
          return <LifeCycle onMount={() => history.push(to)} />;
        }}
      </RouterContext.Consumer>
    );
  }
}

//也就是 Redirect 一旦实例化/挂载 就会直接进行页面的跳转
class LifeCycle extends Component {
  componentDidMount() {
    if (this.props.onMount) {
      this.props.onMount();
    }
  }
  render() {
    return null;
  }
}

export default Redirect;
