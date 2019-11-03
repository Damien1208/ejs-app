var mongoose = require("mongoose");

var parkSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    images: [ String ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

var Park = mongoose.model("Park", parkSchema);

module.exports = Park;
