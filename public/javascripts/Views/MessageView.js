MS.Templates.Tweet = Handlebars.compile($('#tpl-tweet').html());
MS.Templates.Instagram = Handlebars.compile($('#tpl-instagram').html());
MS.Views.TweetView = Backbone.View.extend({
    tagName: "div",
    className: "tweet",
    render: function() {

        var json = this.model.toJSON();
        this.$el.html( MS.Templates.Tweet(json));
        return this;
    }
}) ;

MS.Views.InstagramView = Backbone.View.extend({
    className: "instagram",
    render: function() {
        var json = this.model.toJSON();
        this.$el.html( MS.Templates.Instagram(json));
        return this;
    }
});
MS.Views.MessageView = Backbone.View.extend({
    events: {

    },
    initialize: function(options) {
        this.curWatcher = null;
        this.curPos = null;
        this.curStation = null;
        this.$msgList = this.$('#message-list')
        this.listenTo(this.collection, "reset", this.loaded);
    },
    loaded: function() {
        this.releaseWatcher();

        this.$msgList.html("");
        $(".content-pane").addClass("in");
        this.$el.removeClass("in");

        this.localizeAndDisplay();
        this.curWatcher = navigator.geolocation.watchPosition(
            this.displayLocalizedContent.bind(this),
            function(err) { console.log(err); },
            { frequency: 5000 }
        );
        console.log("Watcher created: " + this.curWatcher);
    },
    releaseWatcher: function() {
        if (this.curWatcher) {
            navigator.geolocation.clearWatch(this.curWatcher);
            console.log("watcher "+this.curWatcher+" released");
            this.curpos = null;
        }
    },
    displayLocalizedContent: function(navgPos) {
        if (this.curpos != null) {
            var dist = MS.Haversine(this.curpos.coords, navgPos.coords);
            console.log("you moved " + dist);
            if (dist < 0.1) {
                console.log("skipped");
                return;
            }
        }
        this.curpos = navgPos;
        var latlng = navgPos.coords;
        var station = this.collection.findNearestStation(latlng);
        if (this.curStation == station) {
            console.log("station didn't change");
            return;
        }
        this.trigger("station:found", station);
        this.curStation = station;
        var $headline = $('<h3 class="station">'+station.get('name')+'</h3>');
        this.$msgList.append($headline);

        var content = this.collection.findContent(station);
        console.log("displaying "+content.length+ " contents on " + station.get('name'));
        var self = this;
        _.each(content, function(msg) {
            var type = msg.get("type");
            var msgView;

            if (type == "tweet") {
                msgView = new MS.Views.TweetView({
                    model: msg
                });
            } else if (type == "instagram") {
                msgView = new MS.Views.InstagramView({
                    model: msg
                });
            }

            self.$msgList.append(msgView.render().$el);
        });
        var scrt = $headline.position().top -20;
        this.$el.scrollToTop(scrt);

    },
    localizeAndDisplay: function() {
        navigator.geolocation.getCurrentPosition(
            this.displayLocalizedContent.bind(this),
            function() { console.log("err"); },
            { timeout:3000 }
        );
    }
});