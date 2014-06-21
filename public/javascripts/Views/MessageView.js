
MS.Views.TweetView = Backbone.View.extend({
    render: function() {

    }
}) ;

MS.Views.MessageView = Backbone.View.extend({
    events: {

    },
    initialize: function(options) {
        this.intvl = null;
        this.listenTo(this.collection, "reset", this.loaded);
    },
    loaded: function() {
        this.intvl = window.setTimeout( this.localizeAndDisplay.bind(this), MS.Constants.MESSAGE_THROTTLE)
    },
    displayLocalizedContent: function(navgPos) {
        var latlng = navgPos.coords;
        var content = this.collection.findContent(latlng);

        this.$el.prepend()
    },
    localizeAndDisplay: function() {
        navigator.geolocation.getCurrentPosition(
            this.displayLocalizedContent.bind(this),
            function() { console.log("err"); },
            { timeout:3000 }
        );
    }
});