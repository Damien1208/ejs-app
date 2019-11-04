var express = require("express"),
    router = express.Router({ mergeParams: true }),
    Comment = require("../models/comment"),
    Park = require("../models/parks")
    isLoggedIn = require("../middleware/auth");

// COMMENTS ROUTES
router.get("/new", isLoggedIn, function (req, res) {
    Park.findById(req.params.id, function (err, park) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { park: park })
        }
    });
});


router.post("/", isLoggedIn, function (req, res) {
    Park.findById(req.params.id, function (err, park) {
        if (err) {
            console.log(err);
            res.redirect("/parks");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.date = new Date().toDateString();
                    comment.save();
                    park.comments.push(comment);
                    park.save();
                    res.redirect("/parks/" + park._id);
                }
            });
        }
    });
});

module.exports = router;
