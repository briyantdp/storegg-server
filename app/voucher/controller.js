const Voucher = require("./model");
const Category = require("../category/model");
const Nominal = require("../nominal/model");

const path = require("path");
const fs = require("fs");
const config = require("../../config");

module.exports = {
  index: async (req, res) => {
    try {
      const voucher = await Voucher.find()
        .populate({ path: "category", select: "name" })
        .populate({ path: "nominals", select: "coinName coinQty price" });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      if (req.session.user === null || req.session.user === undefined) {
        res.redirect("/");
      } else {
        res.render("admin/voucher/view_voucher", {
          voucher,
          alert,
          name: req.session.user.name,
          title: "Voucher",
        });
      }
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const category = await Category.find();
      const nominal = await Nominal.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      res.render("admin/voucher/create", {
        category,
        nominal,
        alert,
        name: req.session.user.name,
        title: "Tambah Voucher",
      });
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
  actionCreate: async (req, res) => {
    const { name, category, nominals } = req.body;
    try {
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
            const voucher = new Voucher({
              name,
              category,
              nominals,
              image: fileName,
            });
            await voucher.save();
            req.flash("alertMessage", "Berhasil tambah voucher");
            req.flash("alertStatus", "success");
            res.redirect("/voucher");
          } catch (error) {
            console.log(error);
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/voucher");
          }
        });
      } else {
        const voucher = new Voucher({
          name,
          category,
          nominals,
        });
        await voucher.save();
        req.flash("alertMessage", "Berhasil tambah voucher");
        req.flash("alertStatus", "success");
        res.redirect("/voucher");
      }
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const voucher = await Voucher.findOne({ _id: id });
      const category = await Category.find();
      const nominal = await Nominal.find();

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      res.render("admin/voucher/edit", {
        voucher,
        category,
        nominal,
        alert,
        name: req.session.user.name,
        title: "Ubah Voucher",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, nominals } = req.body;

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
            const voucher = await Voucher.findOne({ _id: id });
            let currentImage = `${config.rootPath}/public/images/uploads/${voucher.image}`;

            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage);
            }

            await Voucher.findOneAndUpdate(
              { _id: id },
              {
                name,
                category,
                nominals,
                image: fileName,
              }
            );
            req.flash("alertMessage", "Berhasil ubah voucher");
            req.flash("alertStatus", "success");
            res.redirect("/voucher");
          } catch (error) {
            console.log(error);
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/voucher");
          }
        });
      } else {
        await Voucher.findOneAndUpdate(
          { _id: id },
          {
            name,
            category,
            nominals,
          }
        );
        req.flash("alertMessage", "Berhasil ubah voucher");
        req.flash("alertStatus", "success");
        res.redirect("/voucher");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
  actionDelete: async (req, res) => {
    const { id } = req.params;
    try {
      const voucher = await Voucher.findOneAndRemove({ _id: id });

      let currentImage = `${config.rootPath}/public/images/uploads/${voucher.image}`;
      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }

      req.flash("alertMessage", "Berhasil hapus voucher");
      req.flash("alertStatus", "success");
      res.redirect("/voucher");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      let voucher = await Voucher.findOne({ _id: id });
      let status = voucher.status === "Y" ? "N" : "Y";
      voucher = await Voucher.findOneAndUpdate({ _id: id }, { status });
      req.flash("alertMessage", "Berhasil ubah status");
      req.flash("alertStatus", "success");
      res.redirect("/voucher");
    } catch (error) {
      req.flash("alertMessage", "Gagal ubah status");
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
};
