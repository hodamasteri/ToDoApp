//Student: Hoda Masteri
import TodoItem from "./TodoItem";
import { useContext, useEffect } from "react";
import { StateContext } from "../contexts";
import { useResource } from "react-request-hook";

export default function TodoList() {
  const { state, dispatch } = useContext(StateContext);
  const { todoitems } = state;

  const [todo, updatetodo] = useResource(({ id, complete, dateCompleted }) => ({
    url: "/todo/" + String(id),
    method: "patch", // put was deleting other props so I had to use patch instead for partial update
    data: { complete, dateCompleted },
  }));

  useEffect(() => {
    if (todo?.isLoading === false && todo?.data) {
      dispatch({
        type: "TOGGLE_TODO",
        id: todo.data.id,
        complete: todo.data.complete,
        dateCompleted: todo.data.dateCompleted,
      });
    }
  }, [todo]);

  const [todotoremove, deletetodo] = useResource(({ id }) => ({
    url: "/todo/" + String(id),
    method: "delete",
  }));

  useEffect(() => {
    if (todotoremove?.isLoading === false && todotoremove?.data) {
      dispatch({
        type: "DELETE_TODO",
        id: todotoremove.data.id,
      });
    }
  }, [todotoremove]);

  return (
    <div>
      {todoitems.length > 0 &&
        todoitems.map((item, i) => {
          return (
            <div>
              <TodoItem {...item} key={item._id} />
              <input
                type="checkbox"
                checked={item.complete}
                onChange={() => {
                  updatetodo({
                    id: item._id,
                    complete: item.complete,
                    dateCompleted: !item.complete
                      ? Date(Date.now()).toString()
                      : "",
                  });
                }}
              />
              <input
                type="button"
                value="Remove from list?"
                onClick={(e) => {
                  e.preventDefault();
                  deletetodo({ id: item._id });
                }}
              />
            </div>
          );
        })}
    </div>
  );
}
