define([
    'jquery',
    'underscore',
    'backbone',
    'collections/MyClassifiedsCollection',
    'views/my/MyClassifiedsItemView',
    'text!/tpl/my_classifieds.html'
], function($, _, Backbone, MyClassifiedsCollection, MyClassifiedsItemView, template){



    var MyClassifiedView = Backbone.View.extend({

        el: $("#view"),

        events:{
            'click #overlay': 'close'
        },

        initialize:function() {

            var that = this;

            var onDataHandler = function(collection) {
                that.collection = collection;
                that.render();
            };

            var onDataError = function (collection, response) {
                throw new Error(response);
            };

            that.collection = new MyClassifiedsCollection();
            that.collection.fetch({ success : onDataHandler, error: onDataError});
        },

        render:function(){
            var compiledTemplate = _.template(template);
            this.$el.html(compiledTemplate);

            this.collection.each(function(classified) {
                var myClassifiedsItemView = new MyClassifiedsItemView( {model: classified} );
                this.$('tbody').append(myClassifiedsItemView.render().el);
            }, this);

            this.$('.contentbox').bind('click', function(event){
                event.stopPropagation();
            });

        }
    });

    return MyClassifiedView;
});