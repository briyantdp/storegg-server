var express = require("express");
var router = express.Router();
const { viewSignIn, actionSignIn, actionLogout } = require("./controller");

/* GET home page. */
router.post("/", actionSignIn);
router.get("/", viewSignIn);
router.get("/logout", actionLogout);

module.exports = router;
