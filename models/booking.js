const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BookingSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "event",
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("bookings", BookingSchema);
