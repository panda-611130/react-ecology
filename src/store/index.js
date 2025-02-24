import { createStore, applyMiddleware } from "../my_node_moudles/react-redux/index";

import { counterReducer } from "./counterReducer";

const store = createStore(
    counterReducer,
    applyMiddleware(thunk, logger, doSome)
);

export default store;

function doSome({ getState, dispatch }) {
    return (next) => (action) => {
        console.log("==== doSome ===");
        return next(action);
    };
}

function logger({ getState, dispatch }) {
    return (next) => (action) => {
        console.log("==== logger ===");
        return next(action);
    };
}

function thunk({ getState, dispatch }) {
    return (next) => (action) => {
        // action 可以是对象 还可以是函数 ，那不同的形式，操作也不同
        if (typeof action === "function") {
            return action(dispatch, getState);
        } else {
            return next(action);
        }
    };
}
