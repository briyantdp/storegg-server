const mongoose = require("mongoose");

let categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Nama wajib diisi"],
    },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
