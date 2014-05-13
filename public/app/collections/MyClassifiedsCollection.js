define([
    'underscore',
    'backbone',
    'models/ClassifiedModel'
], function(_, Backbone, ClassifiedModel) {

    var MyClassifiedsCollection = Backbone.Collection.extend({

        model: ClassifiedModel,

        url: function(){
            return '/api/classifieds/me';
        }
    });

    return MyClassifiedsCollection;
});