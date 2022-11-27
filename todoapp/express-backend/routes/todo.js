const express = require("express");
const jwt = require("jsonwebtoken");

const Todo = require("../models/Todo");

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgHQwUTAf/ebsNNUX+XXY0rHUKzUh9KmOtDhAAwoxKK5PDeMjZhh/
7MXtQyx/SW33eNYv0jaeVZcq1o5W7bzAMx/C7QbmZ2KvoKgr89/N5XGTMUu8JqqM
wT7mAX3MZgjbf9SoNu0LQZstYwvhU+5UB+OlqRtrJ63YbV7BYcUO/Q8pAgMBAAEC
gYAP+w1PpzbO6jIiFRgUo2vnVZ1Tw4XZRG15RySj5DsKLolkclv6hq3UU1vn5OH+
pAkUvKMXLBPtpNC55y7vxSfCyPkzXEKxuZbooBL4bUurBEvuyPd9vma8BIdOGiT1
hd0F6fL1aMd0cOBvsLksHitM6Fs9hVQgTWcDb8xMvy27AQJBALvR+J5DJ4W9uYvZ
4n+9dc9LoPX8OETwhyKyNVHyE/Z1EuFdqUDLiYKP+2NlZePYujY0cqUeIX9GZcAq
YEUmh3ECQQCeXaxffCijenhIL4834z72FPOCkLlXTuqtWN1PtXUDajArXGDv3kNq
Ri7Y5tdLyqawtx6PzYVC9nDxxiy9udc5AkBAANyFKgNE2xNoqfY6a5jC7FXMnYeb
To/ubeYnp6PP37NwYxdzQij4+hHDnGEtVMSYBiVvSSZHFflEk+w8hFWxAkEAkD1L
YZCpRvSmF0FSFZoh32qHvDTqyq2zK33T3OSuFhUimGvEUtVC28neo2nlUD/cgPnY
mSuco7foeR2B5LAeaQJBALr/KvV4jn41PjSGvXUGSUwhwnOJA4oCcCaFNHyYSDFV
Cg0C5/nwuNPgdlxTLlMHKXe08R3/WmWa+KVB9/ceS/A=
-----END RSA PRIVATE KEY-----`;

const router = express.Router(); // Instantiate a router

// This middleware function checks for the presense of an authorization header, because a user should only
// be able to perform operations like create, toggle, or delete on their own todos.
router.use(function (req, res, next) {
  if (req.header("Authorization")) {
    try {
      req.payload = jwt.verify(req.header("Authorization"), privateKey, {
        algorithms: ["RS256"],
      });
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  } else {
    // If no Authorization header:
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

// route handler for a post request
router.post("/", async function (req, res) {
  const todo = new Todo({
    title: req.body.title,
    description: req.body.description,
    author: req.payload.id,
    dateCreated: req.body.dateCreated,
    complete: req.body.complete,
  }); // anything except the id comes from the request body. Id Must come from payload for security purposes.
  // Data Persistance: Saving into db
  return todo
    .save()
    .then((savedTodo) => {
      return res.status(201).json({
        _id: savedTodo._id,
        title: savedTodo.title,
        description: savedTodo.description,
        author: savedTodo.author,
        dateCreated: savedTodo.dateCreated,
        complete: savedTodo.complete,
      });
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message }); // We should not expose the actual msg though
    });
});

// route handler for a get request to retrieve todos
router.get("/", async function (req, res, next) {
  const todos = await Todo.find().where("author").equals(req.payload.id).exec();
  // Usually we should limit the number of todos returned and avoid sending them all at once. See Mongoose Pagination later
  return res.status(200).json({ todos: todos });
});

// route handler for a get request to retrieve a single todo item
router.get("/:id", async function (req, res, next) {
  const todo = await Todo.findOne().where("_id").equals(req.params.id).exec();
  return res.status(200).json(todo);
});

// route handler for a patch request to toggle todo
router.patch("/:id", async function (req, res) {
  // See if the todo with that specific id is found in db
  const todo = await Todo.findByIdAndUpdate()
    .where("_id")
    .equals(req.params.id)
    .exec();
  // update isComplete and dateCompleted
  todo.isComplete = req.body.isComplete;
  todo.dateCompleted = req.body.dateCompleted;
  todo.save(); // need to save the changes
  return res.status(200).json(todo);
});

// route handler for a http delete request
router.delete("/:id", async function (req, res, next) {
  // deletes todo
  const todo = await Todo.findOneAndDelete()
    .where("_id")
    .equals(req.params.id)
    .exec();
  return res.status(200).json(todo);
});

module.exports = router;
