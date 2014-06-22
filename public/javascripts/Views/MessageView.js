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
        this.intvl = null;
        this.curPos = null;
        this.$msgList = this.$('#message-list')
        this.listenTo(this.collection, "reset", this.loaded);
    },
    loaded: function() {
        this.$msgList.html("");
        $(".content-pane").addClass("in");
        this.$el.removeClass("in");

        this.localizeAndDisplay();
        this.intvl = window.setTimeout(
            this.localizeAndDisplay.bind(this), MS.Constants.MESSAGE_THROTTLE)
    },
    displayLocalizedContent: function(navgPos) {

        var latlng = navgPos.coords;
        var content = this.collection.findContent(latlng);
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


            self.$msgList.prepend(msgView.render().$el);
        });
        //this.$el.prepend();
    },
    localizeAndDisplay: function() {
        navigator.geolocation.getCurrentPosition(
            this.displayLocalizedContent.bind(this),
            function() { console.log("err"); },
            { timeout:3000 }
        );
    }
});