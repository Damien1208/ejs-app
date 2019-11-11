var Park = require("../models/parks");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
};

middlewareObj.checkParkOwnership = function(req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
        Park.findById(req.params.id, function (err, foundPark) {
            if (err || !foundPark) {
                req.flash("error", "This park is unknown!")
                res.redirect("back")
            } else {
                if (foundPark.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!")
        res.redirect("back")
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err || !foundComment) {
                req.flash("error", "Comment not found!");
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

module.exports = middlewareObj;
