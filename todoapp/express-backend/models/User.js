const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Instantiating the schema, and define validations and references (like foreign key in sql)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  todos: [{ type: Schema.Types.ObjectId, ref: "Todo" }],
});
//Compile to a model and export:
module.exports = mongoose.model("User", UserSchema);
