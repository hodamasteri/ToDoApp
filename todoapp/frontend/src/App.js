//Student: Hoda Masteri
import React, { useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import UserBar from "./user/UserBar";
import TodoList from "./todo/TodoList";
import CreateTodo from "./todo/CreateTodo";
import { useEffect } from "react";
import { useResource } from "react-request-hook";

import appReducer from "./reducer";
import { StateContext } from "./contexts";

function App() {
  const [state, dispatch] = useReducer(appReducer, {
    user: {},
    todoitems: [],
  });

  const { user } = state;

  useEffect(() => {
    if (user && user.username) {
      document.title = `${user.username}’s to-do list`;
    } else {
      document.title = "To-do list";
    }
  }, [user]);

  // useEffect(() => {
  //   fetch("/api/todoitems")
  //     .then((result) => result.json())
  //     .then((todoitems) => dispatch({ type: "FETCH_TODOITEMS", todoitems }));
  // }, []);

  const [todoitems, getTodoitems] = useResource(() => ({
    url: "/todo",
    method: "get",
    headers: { Authorization: `${state?.user?.access_token}` },
  }));

  useEffect(() => {
    if (state?.user?.access_token) {
      getTodoitems();
    }
  }, [state?.user?.access_token]);

  useEffect(() => {
    if (todoitems && todoitems.isLoading === false && todoitems.data) {
      dispatch({
        type: "FETCH_TODOITEMS",
        todoitems: todoitems.data.todos.reverse(), // reverse to show the sorted todoitems
      });
    }
  }, [todoitems]);

  return (
    <div>
      <StateContext.Provider value={{ state, dispatch }}>
        <React.Suspense fallback={"Loading..."}>
          <UserBar />
        </React.Suspense>
        {state.user && <TodoList />}
        {state.user && <CreateTodo />}
      </StateContext.Provider>
    </div>
  );
}

export default App;
