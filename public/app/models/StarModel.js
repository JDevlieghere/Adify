define([
    'underscore',
    'backbone',
], function(_, Backbone) {

    var StarModel = Backbone.Model.extend({

        idAttribute: "_id",

        urlRoot: function() {
            return '/api/stars';
        }

    });

    return StarModel;
});