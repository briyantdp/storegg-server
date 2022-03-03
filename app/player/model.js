const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

let playerSchema = mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    email: {
      type: String,
      require: [true, "Email tidak boleh kosong"],
      minLength: [3, "Panjang nama harus 3-225 karakter"],
      maxLength: [225, "Panjang nama harus 3-225 karakter"],
    },
    password: {
      type: String,
      require: [true, "Password tidak boleh kosong"],
      minLength: [8, "Panjang nama harus 8-225 karakter"],
      maxLength: [225, "Panjang nama harus 8-225 karakter"],
    },
    phone: {
      type: String,
      require: [true, "Nomor telepon tidak boleh kosong"],
      minLength: [9, "Panjang nama harus 9-13 karakter"],
      maxLength: [13, "Panjang nama harus 9-13 karakter"],
    },
    username: {
      type: String,
      require: [true, "Username tidak boleh kosong"],
      minLength: [3, "Panjang nama harus 3-225 karakter"],
      maxLength: [225, "Panjang nama harus 3-225 karakter"],
    },
    name: {
      type: String,
      require: [true, "Nama tidak boleh kosong"],
      minLength: [3, "Panjang nama harus 3-225 karakter"],
      maxLength: [225, "Panjang nama harus 3-225 karakter"],
    },
    avatar: {
      type: String,
    },
  },
  { timeStamps: true }
);

playerSchema.path("email").validate(
  async function (value) {
    try {
      const count = await this.model("Player").countDocuments({ email: value });
      return !count;
    } catch (error) {
      throw error;
    }
  },
  (attr) => `${attr.value} sudah terdaftar`
);

playerSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 12);
  next();
});

module.exports = mongoose.model("Player", playerSchema);
