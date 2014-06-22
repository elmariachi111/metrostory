MS.Models.Station = Backbone.Model.extend({
    latLng: function() {
        var loc = this.get('loc');
        return {
            latitude: loc.lat ,
            longitude: loc.lng
        };
    }

});

MS.Models.StationCollection = Backbone.Collection.extend({
    model: MS.Models.Station,
    findClosestStation: function(latlng) {
        var nearestStation = this.min( function( station ) {
            return MS.Haversine(latlng, station.latLng());
        });

        return nearestStation;
    }

});

MS.Models.Message = Backbone.Model.extend({

});

MS.Models.MessageList = Backbone.Collection.extend({
    model: MS.Models.Message,
    initialize: function() {
      this.stations = new MS.Models.StationCollection({})
    },
    url: function() {
        return MS.Constants.API_HOME + "/api/getDataForRoute"
    },
    reload: function(line) {
        this.fetch({data: {line:line}, reset:true});
    },
    parse: function(response) {
        this.stations.reset(response.stations);
        return response.contents;
    },
    findContent: function(latlng) {
       var nearestStation = this.stations.findClosestStation(latlng);

       var tweetsForThatStation = this.filter( function(tweet) {
           return _.some(tweet.get('nearStations'), function(st) {
               return st._id==nearestStation.get('id');
           });
       });

       return tweetsForThatStation;

    }
})

