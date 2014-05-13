define([
    'underscore',
    'backbone',
    'models/StarModel'
], function(_, Backbone, StarModel) {

    var StarCollection = Backbone.Collection.extend({

        model: StarModel,

        url: function(){
            return '/api/stars';
        }
    });

    return StarCollection;
});