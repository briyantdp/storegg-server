const mongoose = require("mongoose");

let nominalSchema = mongoose.Schema(
  {
    coinQty: {
      type: Number,
      default: 0,
    },
    coinName: {
      type: String,
      require: [true, "Nama koin tidak boleh kosong"],
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Nominal", nominalSchema);
