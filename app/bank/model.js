const mongoose = require("mongoose");

let bankSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Nama pemilik tidak boleh kosong"],
    },
    bankName: {
      type: String,
      require: [true, "Nama bank tidak boleh kosong"],
    },
    bankNumber: {
      type: String,
      require: [true, "Nomor rekening tidak boleh kosong"],
    },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Bank", bankSchema);
