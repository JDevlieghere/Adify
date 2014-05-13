define([
    'underscore',
    'backbone',
    'models/ClassifiedModel'
], function(_, Backbone, ClassifiedModel) {

    var ClassifiedCollection = Backbone.Collection.extend({

        model: ClassifiedModel,

        url: function(){
            return '/api/classifieds';
        }
    });

    return ClassifiedCollection;
});