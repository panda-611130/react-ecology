import React, { Component } from "react";
import { createBrowserHistory } from "history";
import { RouterContext } from "../RouterContext";
class BrowserRouter extends Component {
  static computeRootMatch(pathName) {
    return {
      path: "/",
      url: "/",
      params: {},
      isExect: pathName === "/",
    };
  }

  constructor(props) {
    super(props);
    this.history = createBrowserHistory();
    this.state = {
      location: this.history.location,
    };

    this.unListenFunc = this.history.listen((newLocation) => {
      this.setState({
        location: newLocation.location,
      });
    });
  }

  componentWillUnmount() {
    // 关闭historyApi的监听
    if (this.unListenFunc) {
      this.unListenFunc();
    }
  }

  render() {
    return (
      <RouterContext.Provider
        value={{
          history: this.history,
          location: this.state.location,
          math: BrowserRouter.computeRootMatch(this.state.location.pathname),
        }}
      >
        {this.props.children}
      </RouterContext.Provider>
    );
  }
}

export default BrowserRouter;
