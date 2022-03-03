const mongoose = require("mongoose");

let transactionSchema = mongoose.Schema(
  {
    historyVoucherTopUp: {
      gameName: {
        type: String,
        require: [true, "Nama game tidak boleh kosong"],
      },
      category: {
        type: String,
        require: [true, "Kategori tidak boleh kosong"],
      },
      image: {
        type: String,
      },
      coinName: {
        type: String,
        require: [true, "Nama koin tidak boleh kosong"],
      },
      coinQty: {
        type: Number,
        default: 0,
      },
      price: {
        type: Number,
        default: 0,
      },
    },
    historyPayment: {
      name: {
        type: String,
        require: [true, "Nama pengirim tidak boleh kosong"],
      },
      type: {
        type: String,
        require: [true, "Jenis pembayaran tidak boleh kosong"],
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
    name: {
      type: String,
      require: [true, "Nama tidak boleh kosong"],
      minLength: [3, "Panjang nama harus 3-225 karakter"],
      maxLength: [225, "Panjang nama harus 3-225 karakter"],
    },
    accountUser: {
      type: String,
      require: [true, "Nama tidak boleh kosong"],
      minLength: [3, "Panjang nama harus 3-225 karakter"],
      maxLength: [225, "Panjang nama harus 3-225 karakter"],
    },
    voucherTopUp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voucher",
    },
    tax: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    historyUser: {
      name: {
        type: String,
        require: [true, "Nama tidak boleh kosong"],
      },
      phone: {
        type: Number,
        require: [true, "Nomor telepon tidak boleh kosong"],
        minLength: [9, "Panjang nomor telepon harus 9-13 karakter"],
        maxLength: [13, "Panjang nomor telepon harus 9-13 karakter"],
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
