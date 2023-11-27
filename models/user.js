const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    reqiured: true,
  },

  eventCreated: [
    {
      type: Schema.Types.ObjectId,
      ref: "event",
    },
  ],
});

module.exports = mongoose.model("users", userSchema);
