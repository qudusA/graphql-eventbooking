const mongoose = require("mongoose");

const mongoConnect = async () => {
  try {
    const client = await mongoose.connect(
      "mongodb://127.0.0.1:27017/testGraphql"
    );
    return client;
  } catch (err) {
    console.log(err);
  }
};

module.exports = mongoConnect();
