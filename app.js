var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    flash = require("connect-flash"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    User = require("./models/user");
    // seedDB = require("./seeds");

var parksRoutes     = require("./routes/parks"),
    commentsRoutes  = require("./routes/comments"),
    authRoutes      = require("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost:27017/cool-parks";

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(express.static(__dirname + "/public/"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
// seed the database
// seedDB();

// passport configuration
app.use(require("express-session")({
    secret: "Star trek gets something called the prime directive!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// calls routes
app.use("/", authRoutes);
app.use("/parks/:id/comments", commentsRoutes);
app.use("/parks", parksRoutes);

// listen server started
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("server has started at port 3000")
});
