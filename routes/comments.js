var express = require("express"),
    router = express.Router({ mergeParams: true }),
    Comment = require("../models/comment"),
    Park = require("../models/parks")

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
    console.log(req.body.comment)
    console.log(req.params.id)
    Park.findById(req.params.id, function (err, park) {
        console.log('comment', park)
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
                    comment.save();
                    park.comments.push(comment);
                    park.save();
                    res.redirect("/parks/" + park._id);
                }
            });
        }
    });
});

// Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = router;
