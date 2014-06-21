MS.Models.Route = Backbone.Model.extend({

});

MS.Models.Routes = Backbone.Collection.extend({
    model: MS.Models.Route,
    url: function() {
        return MS.Constants.API_HOME +  "/api/getLinesForLoc";
    },
    parse: function(response) {
        return response.items;
    }
});