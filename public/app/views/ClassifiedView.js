define([
    'underscore',
    'backbone',
    'models/ClassifiedModel',
    'collections/ClassifiedCollection',
    'text!/templates/my_classifieds.html'
], function(_, Backbone, ClassifiedModel, ClassifiedCollection, template){


    var ClassifiedView = Backbone.View.extend({

        el: $("#view"),

        initialize:function() {

        },

        render:function(){


        }
    });

    return ClassifiedView;
});