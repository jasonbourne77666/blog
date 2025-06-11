const ADD = 'ADD';
const REMOVE = 'REMOVE';

const initState = {
  count: 10,
};

// reducer
export function counter(state = initState, action) {
  switch (action.type) {
    case ADD:
      return { count: state.count + 1 };
    case REMOVE:
      return { count: state.count - 1 };
    default:
      return initState;
  }
}

export function add() {
  return { type: 'ADD' };
}
export function remove() {
  return { type: 'REMOVE' };
}
