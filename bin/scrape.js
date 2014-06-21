var Request = require('request'),
    und = require('underscore');

var twBase = "https://api.twitter.com/1.1";
var endpoint = "/search/tweets.json";
var maxTweetId;
var tweetIds = [];
var col = Mongo.collection('metrostory');

var getTweets = function(hashTag, callback) {

    var result = Request.get({

        uri: twBase + endpoint,
        qs: {
            q: hashTag,
            count: 100,
            'include_rts': false,
            'since_id': maxTweetId
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
           console.log(st.geo);
           tweetIds.push(st.id);
       }
    });
    maxTweetId = Math.max.apply(Math, tweetIds);
    //console.log(maxTweetId);
    //getTweets('#WM', success);
}

getTweets('#WM', success);