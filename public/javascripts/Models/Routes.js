MS.Models.Route = Backbone.Model.extend({

});

MS.Models.Routes = Backbone.Collection.extend({
    model: MS.Models.Route,
    url: function() {
        return "/api/findRoutesByLoc";
    }
});