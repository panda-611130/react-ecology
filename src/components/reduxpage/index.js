import React, { Component } from "react";
import { connect } from "../../my_node_moudles/react-redux";
import "./index.less";

class reduxPage extends Component {
  render() {
    const { counter, add, minus } = this.props;
    return (
      <div className="react-redux-page">
        <h1>MyReactReduxPage</h1>
        <p>====== {counter} =======</p>
        <div className="button-area">
          <span className="button"
            onClick={() => add(Math.ceil(Math.random() * 10))}>
            +
          </span>
          <span className="button" onClick={minus}>
            -
          </span>
        </div>
      </div>
    );
  }
}

export default connect(
  //mapStateToProps
  (state) => ({ counter: state.count }),
  //mapDispatchToProps,
  {
    add: (value) => ({ type: "add", value: value }),
    minus: () => ({ type: "minus" }),
  }
)(reduxPage);


// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
//     add: (...args) => dispatch(actions.increase(...args)),
//     // ...some action
//   }
// }
