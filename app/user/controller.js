const User = require("./model");
const bcrypt = require("bcryptjs");

module.exports = {
  viewSignIn: async (req, res, next) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      if (req.session.user === null || req.session.user === undefined) {
        res.render("admin/user/view_signin", { alert, title: "Sign In" });
      } else {
        res.redirect("/dashboard");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  },
  actionSignIn: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });

      if (user) {
        if (user.status === "Y") {
          const checkPassword = await bcrypt.compare(password, user.password);
          if (checkPassword) {
            req.session.user = {
              _id: user._id,
              email: user.email,
              password: user.password,
              status: user.status,
              name: user.name,
            };
            res.redirect("/dashboard");
          } else {
            req.flash("alertMessage", "Password yang anda masukkan salah !");
            req.flash("alertStatus", "danger");
            res.redirect("/");
          }
        } else {
          req.flash("alertMessage", "Mohon maaf, anda adalah user tidak aktif");
          req.flash("alertStatus", "danger");
          res.redirect("/");
        }
      } else {
        req.flash("alertMessage", "Email yang anda masukkan salah !");
        req.flash("alertStatus", "danger");
        res.redirect("/");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  },
  actionLogout: async (req, res) => {
    try {
      req.session.destroy();
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  },
};
