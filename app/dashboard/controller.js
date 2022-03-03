const Transaction = require("../transaction/model");
const Voucher = require("../voucher/model");
const Player = require("../player/model");
const Category = require("../category/model");

module.exports = {
  index: async (req, res, next) => {
    try {
      const transaction = await Transaction.find();
      const voucher = await Voucher.find();
      const player = await Player.find();
      const category = await Category.find();

      if (req.session.user === null || req.session.user === undefined) {
        res.redirect("/");
      } else {
        res.render("index", {
          transaction,
          voucher,
          player,
          category,
          name: req.session.user.name,
          title: "Dashboard",
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
