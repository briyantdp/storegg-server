const mongoose = require("mongoose");

let voucherSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "Nama game tidak boleh kosong"],
  },
  image: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Y", "N"],
    default: "Y",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  nominals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Nominal",
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isFeatured: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Voucher", voucherSchema);
