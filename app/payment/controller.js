const Payment = require("./model");
const Bank = require("../bank/model");

module.exports = {
  index: async (req, res, next) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      const payment = await Payment.find().populate("dataPayments");

      if (req.session.user === null || req.session.user === undefined) {
        res.redirect("/");
      } else {
        res.render("admin/payment/view_payment", {
          payment,
          alert,
          name: req.session.user.name,
          title: "Jenis Pembayaran",
        });
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const bank = await Bank.find();
      res.render("admin/payment/create", {
        bank,
        name: req.session.user.name,
        title: "Tambah Jenis Pembayaran",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { type, dataPayments } = req.body;
      const payment = await Payment({ type, dataPayments });
      await payment.save();

      req.flash("alertMessage", "Berhasil tambah jenis pembayaran");
      req.flash("alertStatus", "success");
      res.redirect("/payment");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await Payment.findOne({ _id: id });
      const bank = await Bank.find();
      res.render("admin/payment/edit", {
        payment,
        bank,
        name: req.session.user.name,
        title: "Ubah Jenis Pembayaran",
      });
      res.render("admin/payment/edit");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { type, dataPayments } = req.body;
      await Payment.findOneAndUpdate({ _id: id }, { type, dataPayments });

      req.flash("alertMessage", "Berhasil ubah jenis pembayaran");
      req.flash("alertStatus", "success");
      res.redirect("/payment");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;
      await Payment.findOneAndRemove({ _id: id });

      req.flash("alertMessage", "Berhasil hapus kategori");
      req.flash("alertStatus", "success");
      res.redirect("/payment");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },
  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      let payment = await Payment.findOne({ _id: id });
      let status = payment.status === "Y" ? "N" : "Y";
      payment = await Payment.findOneAndUpdate({ _id: id }, { status });
      req.flash("alertMessage", "Berhasil ubah status");
      req.flash("alertStatus", "success");
      res.redirect("/payment");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },
};
