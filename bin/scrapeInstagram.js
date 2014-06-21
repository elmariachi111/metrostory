var Request = require('request'),
    Mongo = require('../db.js'),
    und = require('underscore'),
    hashTag = "",
    nextUrl,
    col = Mongo.collection('content');

// /Get hashTag from commandLine input
process.argv.forEach(function (val, index, array) {
    //first two arguments are node specific arguments
    if(index = 2)
        hashTag = val;
});
hashTag = hashTag.substring(0, hashTag.length - 1);

var inBase = "https://api.instagram.com/v1";
var endPoint = "/tags/"+ hashTag +"/media/recent";

var getInstaImage = function(hashTag, callback) {

    if(!nextUrl){
        var uri = inBase + endPoint;
    } else if(nextUrl != ""){
        var uri = nextUrl;
    }

    var result = Request.get({

        uri: uri,
        qs: {
            access_token: process.env.INSTAGRAM_ACCESSTOKEN
        },
        json: true
    },function ( error, response, body ) {
        if(!error && response.statusCode == 200){
            callback(null, body);
        } else {
            console.log("F**k" + error);
        }
    });
}

var success = function( err, body ) {
    und.forEach(body.data, function(st){
        if(st.location !== null){
            st._id = st.id;
            st.type = "instagram";
            col.save( st, function(err){

            });
        }
    });
    nextUrl = body.pagination.next_url;
    console.log("Next Page:" + nextUrl);
    getInstaImage(hashTag, success);
}

getInstaImage(hashTag, success);