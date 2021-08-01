export function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case "add":
      const newAddState = {
        count: state.count + action.value,
      };
      return newAddState;
    case "minus":
      const newMinusState = {
        count: state.count - 1,
      };
      return newMinusState;
    default:
      return state;
  }
}
