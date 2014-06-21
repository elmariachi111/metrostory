
MS.Models.Message = Backbone.Model.extend({

});

MS.Models.MessageList = Backbone.Collection.extend({
    model: MS.Models.Message,

    url: function() {
        return "/api/messages"
    }
})

