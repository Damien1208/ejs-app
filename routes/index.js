var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    passport = require("passport");

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
            console.log(err);
            res.redirect("register");
        }
        passport.authenticate("local")(req, res, function () {
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
    res.redirect("/");
});

// Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = router;
