var express = require("express");
const { loggers } = require("winston");
require("dotenv").config();

var router = express.Router();
const { admins } = require("./models/models");

// login user login-button function
router.post("/login", async (req, res) => {
  console.log(1); //debug
  const Admin = await admins.findOne({ id: req.body.id });
  console.log( req.body, "/////////////req body")
  console.log(Admin.id, Admin.password);

  if (Admin.id == req.body.id && req.body.password == Admin.password) {
    console.log(2);
    req.session.user = Admin.id;
    res.redirect(process.env.dashboard_url);
    // res.send(req.session.user);
  } else {
    res.end("try again");
  }
});

// route for dashboard
router.get("/dashboard", (req, res) => {
  if (req.session.user) {
    console.log(3); //debug
    res.render("dashboard", { user: req.session.user });
  } else {
    res.send("Unauthorize User");
  }
});

// route for logout
router.get("/logout", (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
      res.send("Error");
    } else {
      res.render("base", {
        title: "Express",
        logout: "logout Successfully...!",
      });
    }
  });
});

module.exports = router;
