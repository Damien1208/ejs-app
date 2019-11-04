var express = require("express"),
    router = express.Router(),
    Park = require("../models/parks"),
    isLoggedIn = require("../middleware/auth");

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
router.post("/", isLoggedIn, function (req, res) {
    // add in update as well line below
    //req.body.blog.body = req.sanitize(req.body.blog.body);

    var name = req.body.name;
    var image = req.body.image;
    var descr = req.body.description;
    var images = req.body.images;
    var newPark =
    {
        name: name,
        image: image,
        description: descr,
        images: [images]
    }
    Park.create(newPark, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/parks");
        }
    });
});

// NEW
router.get("/new", isLoggedIn, function (req, res) {
    res.render("parks/new");
});

// EDIT
router.get("/:id/edit", function (req, res) {
    Park.findById(req.params.id, function(err, foundPark) {
        if (err) {
            console.log(err);
            res.redirect("/parks")
        } else {
            res.render("parks/edit", { park: foundPark });
        }
    });
});

// SHOW
router.get("/:id", function (req, res) {
    Park.findById(req.params.id).populate("comments").exec(function (err, foundPark) {
        if (err) {
            console.log(err);
        } else {
            res.render("parks/show", { park: foundPark });
        }
    });
});

// UPDATE
router.put("/:id", function (req, res) {
    Park.findByIdAndUpdate(req.params.id, req.body.park, function(err, updatedPark) {
        if (err) {
            res.redirect("/parks");
        } else {
            res.redirect("/parks/" + updatedPark._id);
        }
    });
});

// DELETE
router.delete("/:id", function (req, res) {
    Park.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/parks");
        } else {
            res.redirect("/parks");
        }
    });
});

module.exports = router;
