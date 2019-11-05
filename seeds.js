var mongoose    = require("mongoose");
var Park        = require("./models/parks");
var Comment     = require("./models/comment");

var data = [
    {
        name:"Tiergarten",
        image:"https://tse2.mm.bing.net/th?id=OIP.4zAVGJ3L6GfSkd6W07URgwHaE8&pid=Api&P=0&w=241&h=161",
        description:"The “Central Park” of Berlin, Tiergarten is not only of the most beautiful but also offers great areas for chilling (you can do it naked in some areas), biking, running, canoeing, architecture/sculpture hunting. Our favorite areas are Luiseninsel (a little island inside the park), Café am Neuen See and Englischer Garten/Teehaus for beer drinking and the area around The Victory Column for Architecture and sculpture spotting.",
        images: [
            "https://tse3.mm.bing.net/th?id=OIP.RLsrvcnO2la8G0fB9O_yMQHaFj&pid=Api&P=0&w=220&h=166",
            "https://tse2.mm.bing.net/th?id=OIP.yugYAgafrrgVpovgu5ZbTwHaE8&pid=Api&P=0&w=254&h=170"
        ],
        author: {
            id: '5dbedabfeb15ab26483f1763',
            username: 'damien'
        }
    },
    {
        name:"Körnerpark",
        image:"https://tse2.mm.bing.net/th?id=OIP.BRB2zSXCqkAjcYz78ml1bwHaE8&pid=Api&P=0&w=268&h=179",
        description:"The Körnerpark is situated in Berlin Neukölln between Jonasstraße, Schierker Straße, Selkestraße and Wittmannsdorfer Straße. The approximately 2.4 hectare (about 5.93 acres) park resembles a palace garden. The feature in the eastern part of the park is a cascade with fountains. Opposite, to the west, an orangery houses a café and a gallery for temporary exhibitions, and forms the boundary of the park. During summer weekends the forecourt of the orangery is used for free concerts and performances. The northern part is dominated by a flower garden.",
        images: [
            "https://tse1.mm.bing.net/th?id=OIP.N7rdxHjpriTK3IFK5G0RZQHaE7&pid=Api&P=0&w=267&h=178",
            "https://tse3.mm.bing.net/th?id=OIP.Ahd7Ckc_PMfZky_bvQ_FNgHaE7&pid=Api&P=0&w=278&h=186"
        ],
        author: {
            id: '5dbedabfeb15ab26483f1763',
            username: 'damien'
        }
    }
];

function seedDB() {
    // remove all parks
    Park.deleteMany({}, function(err) {
        if(err) {
            console.log(err);
        }
        console.log("all parks removed!");
        // add a few parks
        data.forEach(function(seed) {
            Park.create(seed, function(err, park) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("added a park");
                    // create a comment
                    Comment.create(
                        {
                            text: "Great park in Berlin",
                            author: {
                                id: '5dbedabfeb15ab26483f1763',
                                username: 'damien'
                            }
                        }, function(err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                park.comments.push(comment);
                                park.save();
                            }
                        }
                    ) 
                }
            });
        });
    });
};

module.exports = seedDB;
