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
            var firstL = it.toUpperCase().charAt(0);
            var cls ="";
            switch( firstL) {
                case "B": cls="bus"; break;
                case "U": cls="ubahn"; break;
                case "S": cls="sbahn"; break;
                case "T": cls="tram"; break;
                case "N": cls="nacht"; break;
                case "R": cls="regio"; break;
            }
            return {'line': it, "class": cls};
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