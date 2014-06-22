var R = require('request'),
    Mongo = require('../db.js'),
    und = require('underscore');

var TWITTER_BASE_URL = "https://api.twitter.com/1.1";
var TWITTER_ENDPOINT = "/search/tweets.json";


var Parser = function(criteria) {
    this.criteria = criteria;
    this.col = Mongo.collection('content');
    this.loop = 0;

};

Parser.prototype = {

    getTweets: function(lastTweetId) {

        var qs = und.extend({ count: 100}, this.criteria);

        if (lastTweetId != undefined) {
            qs['max_id'] =  lastTweetId;
        }
        var self = this;
        R.get({
                uri: TWITTER_BASE_URL + TWITTER_ENDPOINT,
                qs: qs,
                json: true,
                auth: { 'bearer': process.env.TWITTER_ACCESSTOKEN}
            },
            function ( error, response, body ){
                if(!error && response.statusCode == 200){
                    self.received(null, body);
                } else {
                    console.log("F**k" + error);
                    self.received(error,null);
                }
            });
    },
    received: function(err, body) {
        var tweetIds = [];
        var stations = Mongo.collection("stations");
        var self = this;

        und.each( body.statuses, function(st) {
            if(st.geo !== null) {
                st._id = st.id_str;
                st.type="tweet";
                st.created_at = new Date(st.created_at);
                stations.find({ "loc" : {
                    $near : {
                        $geometry : {
                            type : "Point" ,
                            coordinates : st.coordinates.coordinates },
                        $maxDistance : 200
                    }
                }
                }).toArray(function (err, result) {
                    if(!err){
                        st.nearStations = result;
                        if (result.length > 0) {
                            self.col.save(st, function(err){ });
                            //console.log("saving " + st.text);
                        }
                    } else {
                        console.log("Ups..." + err);
                    }
                });
                tweetIds.push(st.id_str);
            }
        });
        var minTweetId = und.min(tweetIds);
        this.loop++;
        console.log("again");
        if (this.loop < 15)
            return this.getTweets(minTweetId);

    }

}

module.exports = Parser;
