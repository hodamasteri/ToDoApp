var express = require("express"); // load express module

var app = express(); //Create express app

require("./setupMongo")(); //Invoking my DB connection method defined in setupMongo

app.use(express.json());
app.use("/auth", require("./routes/auth")); // If the express server app receives any request to /auth, redirect execution to auth route handler
app.use("/todo", require("./routes/todo")); // If the express server app receives any request to /todo, redirect execution to todo route handler

// from class slides:
// app.use(function (err, req, res, next) {
//     console.error(err.stack);
//   });

module.exports = app;
