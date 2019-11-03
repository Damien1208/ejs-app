var express = require("express");
var router = express.Router();
var Park = require("../models/parks");

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
router.post("/", function (req, res) {
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
router.get("/new", function (req, res) {
    res.render("parks/new");
});

// EDIT
router.get("/:id/edit", function (req, res) {

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

// DELETE

module.exports = router;
