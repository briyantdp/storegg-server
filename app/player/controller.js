const Voucher = require("../voucher/model");
const Nominal = require("../nominal/model");
const Payment = require("../payment/model");
const Category = require("../category/model");
const Bank = require("../bank/model");
const Transaction = require("../transaction/model");
const Player = require("./model");

const path = require("path");
const fs = require("fs");
const config = require("../../config");

module.exports = {
  landingPage: async (req, res) => {
    try {
      const voucher = await Voucher.find()
        .select("_id status name category image")
        .populate("category");

      res.status(200).json({ data: voucher });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Terjadi kesalahan server" });
    }
  },
  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const voucher = await Voucher.findOne({ _id: id })
        .populate("nominals")
        .populate({ path: "user", select: "_id name" })
        .populate("category");
      const payment = await Payment.find().populate("dataPayments");

      res.status(200).json({
        data: {
          detail: voucher,
          payment,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Terjadi kesalahan server" });
    }
  },
  category: async (req, res) => {
    try {
      const category = await Category.find();
      res.status(200).json({
        data: category,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Terjadi kesalahan server" });
    }
  },
  checkout: async (req, res) => {
    try {
      const { voucherId, accountUser, nominalId, name, paymentId, bankId } =
        req.body;

      const voucher = await Voucher.findOne({ _id: voucherId })
        .select("_id name image category user")
        .populate("category")
        .populate("user");
      if (!voucher)
        res.status(404).json({ message: "Voucher tidak ditemukan" });

      const nominal = await Nominal.findOne({ _id: nominalId });
      if (!nominal)
        res.status(404).json({ message: "Nominal tidak ditemukan" });

      const payment = await Payment.findOne({ _id: paymentId }).populate(
        "dataPayments"
      );
      if (!payment)
        res.status(404).json({ message: "Payment tidak ditemukan" });

      const bank = await Bank.findOne({ _id: bankId });
      if (!bank) res.status(404).json({ message: "Bank tidak ditemukan" });

      let tax = (10 / 100) * nominal._doc.price;
      let value = nominal._doc.price - tax;

      const payload = {
        historyVoucherTopUp: {
          gameName: voucher._doc.name,
          category: voucher._doc.category,
          image: voucher._doc.image,
          coinName: nominal._doc.coinName,
          coinQty: nominal._doc.coinQty,
          price: nominal._doc.price,
        },
        historyPayment: {
          name: bank._doc.name,
          type: payment._doc.type,
          bankName: bank._doc.bankName,
          bankNumber: bank._doc.bankNumber,
        },
        name: name,
        accountUser: accountUser,
        tax: tax,
        value: value,
        player: req.player._id,
        historyUser: {
          name: voucher._doc.user.name,
          phone: voucher._doc.user.phone,
        },
        category: voucher._doc.category._id,
        user: voucher._doc.user._id,
      };

      const transaction = new Transaction(payload);
      await transaction.save();
      res.status(201).json({ data: transaction });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Terjadi kesalahan server" });
    }
  },
  history: async (req, res) => {
    try {
      const { status = "" } = req.query;
      let criteria = {};

      if (status.length) {
        criteria = {
          ...criteria,
          status: { $regex: `${status}`, $options: "i" },
        };
      }

      if (req.player._id) {
        criteria = {
          ...criteria,
          player: req.player._id,
        };
      }

      const history = await Transaction.find(criteria);

      let total = await Transaction.aggregate([
        { $match: criteria },
        {
          $group: {
            _id: null,
            value: { $sum: "$value" },
          },
        },
      ]);

      res
        .status(200)
        .json({ data: history, total: total.length ? total[0].value : 0 });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Terjadi kesalahan server" });
    }
  },
  historyDetail: async (req, res) => {
    try {
      const { id } = req.params;
      const history = await Transaction.findOne({ _id: id });

      if (!history)
        res.status(404).json({ message: "History tidak ditemukan" });

      res.status(200).json({ data: history });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Terjadi kesalahan server" });
    }
  },
  dashboard: async (req, res) => {
    try {
      const count = await Transaction.aggregate([
        { $match: { player: req.player._id } },
        {
          $group: {
            _id: "$category",
            value: { $sum: "$value" },
          },
        },
      ]);

      const category = await Category.find();

      category.forEach((element) => {
        count.forEach((data) => {
          if (data._id.toString() === element._id.toString()) {
            data.name = element.name;
          }
        });
      });

      const history = await Transaction.find({ player: req.player._id })
        .populate("category")
        .sort({ updatedAt: -1 });

      res.status(200).json({ data: history, count: count });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Terjadi kesalahan server" });
    }
  },
  profile: async (req, res) => {
    try {
      const player = {
        id: req.player.id,
        email: req.player.email,
        phone: req.player.phone,
        username: req.player.username,
        name: req.player.name,
        avatar: req.player.avatar,
      };

      res.status(200).json({ data: player });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Terjadi kesalahan server" });
    }
  },
  editProfile: async (req, res, next) => {
    try {
      const { name = "", phone = "" } = req.body;

      const payload = {};

      if (name.length) payload.name = name;
      if (phone.length) payload.phone = phone;

      if (req.file) {
        let tmpPath = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let fileName = req.file.filename + "." + originalExt;
        let targetPath = path.resolve(
          config.rootPath,
          `public/images/uploads/${fileName}`
        );

        const src = fs.createReadStream(tmpPath);
        const dest = fs.createWriteStream(targetPath);

        src.pipe(dest);
        src.on("end", async () => {
          try {
            let player = await Player.findOne({ _id: req.player._id });
            let currentImage = `${config.rootPath}/public/images/uploads/${player.avatar}`;

            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage);
            }

            player = await Player.findOneAndUpdate(
              { _id: req.player._id },
              {
                ...payload,
                avatar: fileName,
              },
              { new: true, runValidators: true }
            );

            res.status(201).json({
              data: {
                id: player.id,
                name: player.name,
                phone: player.phone,
                avatar: player.avatar,
              },
            });
          } catch (error) {
            res.status(40);
          }
        });
        src.on("err", async () => {
          next(err);
        });
      } else {
        const player = await Player.findOneAndUpdate(
          { _id: req.player._id },
          payload,
          { new: true, runValidators: true }
        );

        res.status(201).json({
          data: {
            id: player.id,
            name: player.name,
            phone: player.phone,
            avatar: player.avatar,
          },
        });
      }
    } catch (err) {
      if (err && err.name === "ValidationError") {
        res
          .status(422)
          .json({ error: 1, message: err.message, fields: err.errors });
      }
    }
  },
};
