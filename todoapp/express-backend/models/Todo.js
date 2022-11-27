const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Instantiating the schema, and define validations and reference
const TodoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" }, // Like a foreign key in sql
  dateCreated: { type: String }, // Should I specify default: Date.now().toString() ?
  complete: { type: Boolean, default: false },
  dateCompleted: { type: String, default: "" },
});

//Compile the schema into a model and export
module.exports = mongoose.model("Todo", TodoSchema);
