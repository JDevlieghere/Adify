define([
    'underscore',
    'backbone'
], function(_, Backbone) {

    var MessageModel = Backbone.Model.extend({

        idAttribute: "_id",

        urlRoot: function() {
            return '/api/message';
        }
    });

    return MessageModel;
});