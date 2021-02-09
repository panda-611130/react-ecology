import React, { Component } from "react";
import { connect } from "../../my_node_moudles/react-redux";
import "./index.less";

class reduxPage extends Component {
  render() {
    const { counter, add, minus } = this.props;
    return (
      <div>
        <h1>MyReactReduxPage</h1>
        <p>====={counter}=======</p>
        <button onClick={add}>add</button>
        &nbsp; &nbsp; &nbsp; &nbsp;
        <button onClick={minus}>minus</button>
      </div>
    );
  }
}

export default connect(
  //mapStateToProps
  (state) => ({ counter: state.count }),
  //mapDispatchToProps
  {
    add: () => ({ type: "add" }),
    minus: () => ({ type: "minus" }),
  }
)(reduxPage);
