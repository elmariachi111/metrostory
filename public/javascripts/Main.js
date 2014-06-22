MS = {
    Views: {},
    Models: {},
    Templates: {},
    Constants: {
        //API_HOME: "http://metrostory.cloudcontrolapp.com",
        API_HOME: "http://localhost:3000",
        DEFAULT_ROUTE_RADIUS: 1500,
        MESSAGE_THROTTLE: 1000 //poll every 15s
    },
    Haversine: function(start, end, options) {

        // convert to radians
        var toRad = function(num) {
            return num * Math.PI / 180
        }

        var miles = 3960
        var km    = 6371
        options   = options || {}

        var R = options.unit === 'km' ? km : miles

        var dLat = toRad(end.latitude - start.latitude)
        var dLon = toRad(end.longitude - start.longitude)
        var lat1 = toRad(start.latitude)
        var lat2 = toRad(end.latitude)

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2)
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

        if (options.threshold) {
            return options.threshold > (R * c)
        } else {
            return R * c
        }
    }

};


Handlebars.registerHelper('datefmt', function(date) {
    var m = moment(date);
    return m.format("DD.MM.YY HH:mm");
});
Handlebars.registerHelper('tweettxt', function(tweet) {

    var  txt = tweet.text;
    var res = "";
    var hts = tweet.entities.hashtags;
    if (hts.length > 0 ) {
        var cur = 0;
        _.forEach(hts, function(ht) {
            res += txt.substr(cur, ht.indices[0]-cur);
            var lnk = 'https://twitter.com/hashtag/'+ht.text+'?src=hash';
            res += ' <a href="'+lnk+'" target="_blank">'+'#'+ht.text+'</a> ';
            cur = ht.indices[1];
        });
        res += txt.substr(cur);
    } else {
        res = tweet.text;
    }
    return res;
});


