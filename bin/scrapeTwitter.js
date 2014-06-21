var Request = require('request'),
    Mongo = require('../db.js'),
    und = require('underscore');

var twBase = "https://api.twitter.com/1.1";
var endpoint = "/search/tweets.json";

var lastTweetId;
var tweetIds = [];
var hashTags = "";

var col = Mongo.collection('content');
var stations = Mongo.collection('stations');

//Get hashTags from commandLine input
process.argv.forEach(function (val, index, array) {
    //first two arguments are node specific arguments
    if(index >= 2)
        hashTags += "%23" + val + "+";
});
hashTags = hashTags.substring(0, hashTags.length - 1);

var getTweets = function(hashTag, callback) {

    var result = Request.get({

        uri: twBase + endpoint,
        qs: {
            q: hashTag,
            count: 100,
            'include_rts': false,
            max_id: lastTweetId
        },
        json: true,
        auth: { 'bearer': process.env.TWITTER_ACCESSTOKEN}
    },
    function ( error, response, body ){
        if(!error && response.statusCode == 200){
            callback(null, body);
        } else {
            console.log("F**k" + error);
        }
    });
}

var success = function(err, body) {
    und.forEach( body.statuses, function(st) {
       if(st.geo !== null) {
           st._id = st.id_str;
           st.type="tweet";

           stations.find({ "loc" :
           { $near :
           {
               $geometry : {
                   type : "Point" ,
                   coordinates : st.coordinates.coordinates },
               $maxDistance : 200
           }
           }
           }).toArray(function (err, result) {
                if(!err){
                    st.nearStations = result;
                       if (result.length == 0) {
                        col.save(st, function(err){

                        });
                    }
                } else {
                    console.log("Ups..." + err);
                }
           });
           tweetIds.push(st.id);
       }
    });

    if(lastTweetId == Math.min.apply(Math, tweetIds)){
        console.log("Scrape Tweets");
    } else{
        lastTweetId = Math.min.apply(Math, tweetIds);
        console.log("LastTweetId:" + lastTweetId);
        getTweets(hashTags, success);
    }
}

getTweets(hashTags, success);