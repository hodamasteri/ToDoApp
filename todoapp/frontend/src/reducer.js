//Student: Hoda Masteri

// Reducers take the current state and action, and return the next state
function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
    case "REGISTER":
      return {
        username: action.username,
        access_token: action.access_token,
      };
    case "LOGOUT":
      return null;
    default:
      return state;
  }
}

// Reducer for taking actions like: create, toggle, delete, and fetch todo items
function todoReducer(state, action) {
  switch (action.type) {
    case "CREATE_TODO": // create a new todo item
      const newTodo = {
        title: action.title,
        description: action.description,
        author: action.author,
        dateCreated: action.dateCreated,
        complete: action.complete,
        dateCompleted: action.dateCompleted,
        id: action.id,
      };
      return [newTodo, ...state]; // prepend the new todo item to the copied state (array of todo items) and return it

    case "TOGGLE_TODO":
      return state.map((todoItem) => {
        if (todoItem.id === action.id) {
          return {
            ...todoItem,
            complete: action.complete,
            dateCompleted: action.dateCompleted,
          };
        } else {
          return todoItem;
        }
      });

    case "DELETE_TODO":
      return state.filter((todoItem) => todoItem.id !== action.id);

    case "FETCH_TODOITEMS":
      return action.todoitems;

    case "CLEAR_POSTS":
      return [];

    default:
      return state;
  }
}

// appReducer function is used to call the other two reducer functions from above, and return them.
export default function appReducer(state, action) {
  return {
    user: userReducer(state.user, action),
    todoitems: todoReducer(state.todoitems, action),
  };
}
