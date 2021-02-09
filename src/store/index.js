import { createStore } from "../my_node_moudles/react-redux/index";

import { counterReducer } from "./counterReducer";

const store = createStore(counterReducer);

export default store;
