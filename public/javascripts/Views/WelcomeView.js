MS.Views.RouteList = Backbone.View.extend({
    events: {
        "tap .route": "routeSelected"
    },
    initialize: function() {
        this.listenTo(this.collection, "reset", this.showRoutes);
    },
    showRoutes: function() {
        this.$el.html("");
        var self = this;
        this.collection.each( function(r)  {
            var html = '<li class="table-view-cell route" data-line="'+ r.get('line') +'">'+ r.get('line')+'</li>';
            self.$el.append( $(html) );
        });
    },
    routeSelected: function(evt) {
        var line = $(evt.target).attr("data-line");
        this.trigger("selected:route", line);
    }

});

MS.Views.WelcomeView = Backbone.View.extend({
    events: {
        "tap #btn-localize": "localize"
    },
    initialize: function(options) {
        this.messageList = options.messageList;
        this.routeChoices = new MS.Models.Routes;
        this.routeList = new MS.Views.RouteList( {
            collection: this.routeChoices,
            el: this.$('#route-list')
        });

    },
    localized: function(navgPos) {

        this.trigger("localized", navgPos.coords);
        this.routeChoices.fetch({data: {
                lat: navgPos.coords.latitude,
                lon: navgPos.coords.longitude },
                reset:true}
        );
    },
    routeSelected: function(route) {
        this.messageList.fetch({data: navgPos.coords, reset:true});
    },

    localizationFailed: function() {
        console.log("failed");
    },
    localize: function() {
        navigator.geolocation.getCurrentPosition(
            this.localized.bind(this),
            this.localizationFailed.bind(this),
            { timeout:10000 }
        );
    }
});
