var express = require("express"),
    router = express.Router(),
    Park = require("../models/parks"),
    middleware = require("../middleware");

// INDEX
router.get("/", function (req, res) {
    Park.find({}, function (err, parks) {
        if (err) {
            console.log(err);
        } else {
            res.render("parks/index", { parks: parks, currentUser: req.user })
        }
    })
});

// CREATE
router.post("/", middleware.isLoggedIn, function (req, res) {
    // add in update as well line below
    //req.body.blog.body = req.sanitize(req.body.blog.body);

    var name = req.body.name;
    var image = req.body.image;
    var descr = req.body.description;
    var images = req.body.images;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newPark =
    {
        name: name,
        image: image,
        description: descr,
        images: [images],
        author: author
    }
    Park.create(newPark, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "Your park has been added!");
            res.redirect("/parks");
        }
    });
});

// NEW
router.get("/new",  middleware.isLoggedIn, function (req, res) {
    res.render("parks/new");
});

// EDIT
router.get("/:id/edit", middleware.checkParkOwnership, function (req, res) {
    Park.findById(req.params.id, function (err, foundPark) {
        if (err) {
            req.flash("error", "Park not found!");
            res.redirect("/parks")
        } else {
            res.render("parks/edit", { park: foundPark });
        }
    });
});

// SHOW
router.get("/:id", function (req, res) {
    Park.findById(req.params.id).populate("comments").exec(function (err, foundPark) {
        if (err || !foundPark) {
            req.flash("error", "Park not found!");
            res.redirect("/parks");
        } else {
            res.render("parks/show", { park: foundPark });
        }
    });
});

// UPDATE
router.put("/:id", middleware.checkParkOwnership, function (req, res) {
    Park.findByIdAndUpdate(req.params.id, req.body.park, function (err, updatedPark) {
        if (err) {
            res.redirect("/parks");
        } else {
            res.redirect("/parks/" + updatedPark._id);
        }
    });
});

// DELETE
router.delete("/:id", middleware.checkParkOwnership, function (req, res) {
    Park.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/parks");
        } else {
            res.redirect("/parks");
        }
    });
});

module.exports = router;
