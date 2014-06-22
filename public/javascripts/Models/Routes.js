MS.Models.Route = Backbone.Model.extend({

});

MS.Models.Routes = Backbone.Collection.extend({
    model: MS.Models.Route,
    initialize: function() {
      this.on("localized", this.localized);
    },
    url: function() {
        return MS.Constants.API_HOME +  "/api/getLinesForLoc";
    },
    parse: function(response) {
        var ret = _.map(response.items, function(it) {
            return {'line': it};
        })
        return ret;
    },
    localized: function(navgPos) {
        this.fetch({data: {
                lat: navgPos.latitude,
                lon: navgPos.longitude,
                radius:MS.Constants.DEFAULT_ROUTE_RADIUS},
                reset:true}
        );
    }
});