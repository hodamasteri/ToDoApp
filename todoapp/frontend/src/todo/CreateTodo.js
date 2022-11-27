//Student: Hoda Masteri
import { useState, useContext, useEffect } from "react";
import { StateContext } from "../contexts";
import { v4 as uuidv4 } from "uuid";
import { useResource } from "react-request-hook";

export default function CreateTodo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateCreated, setDateCreated] = useState(Date(Date.now()).toString());
  const [complete, setStatus] = useState(false);
  const [dateCompleted, setDate] = useState("");
  const [error, setError] = useState(false);

  const { state, dispatch } = useContext(StateContext);
  const { user } = state;
  // function handleStatus(evt) {setStatus(!complete);}

  const [todoItem, CreateTodo] = useResource(
    ({ title, description, dateCreated, complete }) => ({
      url: "/todo",
      method: "post",
      headers: { Authorization: `${state.user.access_token}` },
      data: { title, description, dateCreated, complete },
    })
  );

  // Professor posted this update on D2L: use an effecthook with a dependency on the todoItem returned from useResource.
  // Ensure the newly created todo item didn't return an error; handle if it did (conditional rendering)
  useEffect(() => {
    //Optional chaining: Any error occured?
    if (todoItem?.error) {
      setError(true);
      //alert("Something went wrong creating todo item.");
    }
    // If a network request is fired and was successful and a todoitem is created server-side: dispatch CREATE_TODO!
    if (todoItem?.isLoading === false && todoItem?.data) {
      dispatch({
        type: "CREATE_TODO",
        title: todoItem.data.title,
        description: todoItem.data.description,
        author: user.username,
        dateCreated: todoItem.data.dateCreated,
        complete: todoItem.data.complete,
        id: todoItem.data.id,
      });
    }
  }, [todoItem]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        CreateTodo({ title, description, dateCreated, complete }); // remove author?
        // dispatch({
        //   type: "CREATE_TODO",
        //   title,
        //   description,
        //   author: user,
        //   dateCreated,
        //   complete,
        //   dateCompleted,
        //   id: uuidv4(),   // we need to use the id that is generated server-side
        // });
      }}
    >
      <div>
        <br></br>
        Author: <b>{user.username}</b>
      </div>
      <div>
        <label htmlFor="create-title">Title:</label>
        <input
          type="text"
          name="create-title"
          id="create-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <input type="submit" value="Create" disabled={title.length === 0} />
    </form>
  );
}
