var express = require("express"),
    router = express.Router({ mergeParams: true }),
    Comment = require("../models/comment"),
    Park = require("../models/parks")
    middleware = require("../middleware");

// COMMENTS ROUTES
// new comment
router.get("/new", middleware.isLoggedIn, function (req, res) {
    Park.findById(req.params.id, function (err, park) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { park: park })
        }
    });
});

// create comment
router.post("/", middleware.isLoggedIn, function (req, res) {
    Park.findById(req.params.id, function (err, park) {
        if (err) {
            req.flash("error", "Something went wrong!");
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
                    req.flash("success", "Your comment has been added!")
                    res.redirect("/parks/" + park._id);
                }
            });
        }
    });
});

// edit an existing comment
router.get("/:comment_id/edit", function(req, res) {
    Park.findById(req.params.id, function (err, foundPark) {
        if (err || !foundPark) {
            req.flash("error", "Park not found!");
            res.redirect("back");
        } else {
            Comment.findById(req.params.comment_id, middleware.checkCommentOwnership, function (err, foundComment) {
                if (err) {
                    res.redirect("back");
                } else {
                    res.render("comments/edit", { park_id: req.params.id, comment: foundComment, parkName: req.params.name });
                }
            });
        }
    });
});

// update an existing comment
router.put("/:comment_id", function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, middleware.checkCommentOwnership, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/parks/" + req.params.id);
        }
    });
});

// delete an existing comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment has been deleted!");
            res.redirect("/parks/" + req.params.id);
        }
    });
});

module.exports = router;
