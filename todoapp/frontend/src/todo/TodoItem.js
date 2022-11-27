//Student: Hoda Masteri
import React from "react";

function TodoItem({
  title,
  description,
  author,
  dateCreated,
  complete,
  dateCompleted,
}) {
  return (
    <div>
      <h3>{title}</h3>
      <div>{description}</div>
      <br />
      <i>
        Written by: <b>{author}</b>
      </i>
      <div>Created on: {dateCreated}</div>
      <div>Completed on: {dateCompleted}</div>
      <div>Complete: {complete}</div>
    </div>
  );
}

export default React.memo(TodoItem);
