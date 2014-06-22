MS.Views.Navbar = Backbone.View.extend({
   events: {
       "tap #btn-checkin": "checkin"
   },
    initialize: function(options) {
        this.listenTo(options.routeView, "routes:shown selected:route", this.showTitle);
    },
    showTitle: function(title) {
        this.$('h1').html(title);

    },
   checkin: function() {
       this.showTitle("Metro Story");
       this.trigger("checkin");
   }


});
MS.Views.Stationbar = Backbone.View.extend({
    events: {

    },
    displayStation: function(station) {
      this.$('h4').html(station.get('name'));
      this.show();
    },
    show: function() {
        this.$el.addClass("out");
        window.setTimeout( this.hide.bind(this), 3000);
    },
    hide: function() {
        this.$el.removeClass("out");
    }

});

MS.Views.RouteSelectionView = Backbone.View.extend({
    events: {
        "tap .route": "routeSelected"
    },
    initialize: function() {
        this.collection = new MS.Models.Routes;

        this.listenTo(this.collection, "reset", this.showRoutes);
        this.$tableView = this.$("ul.table-view");
    },
    showRoutes: function() {

        this.$tableView.html("");
        var self = this;
        this.collection.each( function(r)  {
            var html = '<li class="table-view-cell route" data-line="'+ r.get('line') +'">'+ r.get('line')+'</li>';
            self.$tableView.append( $(html) );
        });
        this.trigger("routes:shown", "Routes");
        $(".content-pane").addClass("in");
        this.$el.removeClass("in");
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
        this.routeView = options.routeView;
    },
    localized: function(navgPos) {
        this.routeView.collection.trigger("localized", navgPos.coords);

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
