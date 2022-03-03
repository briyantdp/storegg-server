const Nominal = require("./model");

module.exports = {
  index: async (req, res, next) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      const nominal = await Nominal.find();

      if (req.session.user === null || req.session.user === undefined) {
        res.redirect("/");
      } else {
        res.render("admin/nominal/view_nominal", {
          nominal,
          alert,
          name: req.session.user.name,
          title: "Nominal",
        });
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/nominal/create", {
        name: req.session.user.name,
        title: "Tambah Nominal",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { coinQty, coinName, price } = req.body;
      const nominal = await Nominal({ coinName, coinQty, price });
      await nominal.save();

      req.flash("alertMessage", "Berhasil tambah nominal");
      req.flash("alertStatus", "success");
      res.redirect("/nominal");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const nominal = await Nominal.findOne({ _id: id });
      res.render("admin/nominal/edit", {
        nominal,
        name: req.session.user.name,
        title: "Ubah Nominal",
      });
      res.render("admin/nominal/create");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { coinQty, coinName, price } = req.body;
      await Nominal.findOneAndUpdate({ _id: id }, { coinQty, coinName, price });

      req.flash("alertMessage", "Berhasil ubah nominal");
      req.flash("alertStatus", "success");
      res.redirect("/nominal");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;
      await Nominal.findOneAndRemove({ _id: id });

      req.flash("alertMessage", "Berhasil hapus kategori");
      req.flash("alertStatus", "success");
      res.redirect("/nominal");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },
};
