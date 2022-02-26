const mongoose = require("mongoose");
const { mongoURL } = require("../config");

mongoose.connect(mongoURL, {
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true,
  useNewUrlParser: true,
});

const db = mongoose.connection;
module.exports = db;
