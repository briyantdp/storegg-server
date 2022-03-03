const mongoose = require("mongoose");

let userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, "Email tidak boleh kosong"],
    },
    name: {
      type: String,
      require: [true, "Nama tidak boleh kosong"],
    },
    password: {
      type: String,
      require: [true, "Password tidak boleh kosong"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "admin",
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    phone: {
      type: String,
      require: [true, "Nomor telepon tidak boleh kosong"],
    },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("User", userSchema);
