const Bank = require("./model");

module.exports = {
  index: async (req, res, next) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      const bank = await Bank.find();

      if (req.session.user === null || req.session.user === undefined) {
        res.redirect("/");
      } else {
        res.render("admin/bank/view_bank", {
          bank,
          alert,
          name: req.session.user.name,
          title: "Bank",
        });
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/bank/create", {
        name: req.session.user.name,
        title: "Tambah Bank",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { name, bankName, bankNumber } = req.body;
      const bank = await Bank({ name, bankName, bankNumber });
      await bank.save();

      req.flash("alertMessage", "Berhasil tambah bank");
      req.flash("alertStatus", "success");
      res.redirect("/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await Bank.findOne({ _id: id });
      res.render("admin/bank/edit", {
        bank,
        name: req.session.user.name,
        title: "Ubah Bank",
      });
      res.render("admin/bank/edit");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, bankName, bankNumber } = req.body;
      await Bank.findOneAndUpdate({ _id: id }, { name, bankName, bankNumber });

      req.flash("alertMessage", "Berhasil ubah bank");
      req.flash("alertStatus", "success");
      res.redirect("/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;
      await Bank.findOneAndRemove({ _id: id });

      req.flash("alertMessage", "Berhasil hapus bank");
      req.flash("alertStatus", "success");
      res.redirect("/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },
};
