var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    passport = require("passport");
    middleware = require("../middleware");

// Default route
router.get("/", function (req, res) {
    res.render("homepage");
});

// Authentification routes
// Sign up
router.get("/register", function (req, res) {
    res.render("register");
});

router.post("/register", function (req, res) {
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to Cool Parks" + user.username);
            res.redirect("/parks");
        });
    });
});

// Login
router.get("/login", function (req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/parks",
    failureRedirect: "/login"
}), function (req, res) {
});

// Logout
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Successfully logged out!");
    res.redirect("/");
});

module.exports = router;
