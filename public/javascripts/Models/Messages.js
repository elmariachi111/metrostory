
MS.Models.Message = Backbone.Model.extend({

});

MS.Models.MessageList = Backbone.Collection.extend({
    model: MS.Models.Message,

    url: function() {
        return MS.Constants.API_HOME + "/api/messages"
    },
    reload: function(route) {
        this.fetch({data: {route:route}, reset:true});
    },
    parse: function(response) {
        return response;
    }
})

