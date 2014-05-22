define([
    'jquery',
    'underscore',
    'backbone',
    'collections/StarCollection',
    'views/star/StarredClassifiedsItemView',
    'text!/tpl/starred_classifieds.html',
], function($, _, Backbone, StarCollection, StarredClassifiedsItemView, template){


    var StarredClassifiedView = Backbone.View.extend({

        el: $("#view"),

        events:{
            'click #overlay' : 'close',
            'click .close-dialog': 'close'
        },

        initialize:function(options) {
            this.starCollection = options.starCollection;
        },


        render:function(){
            var compiledTemplate = _.template(template);
            this.$el.removeClass('hidden');
            this.$el.html(compiledTemplate);

            this.starCollection.each(function(classified) {
                var starredClassifiedsItemView = new StarredClassifiedsItemView( {model: classified} );
                this.$('tbody').append(starredClassifiedsItemView.render().el);
            }, this);

            var that = this;

            this.$(".contentbox").bind('click',function(event){
                if($(event.target).attr('id') =='close-a'){
                    that.close();
                }
                event.stopPropagation();
            });


            return this;


        }
    });

    return StarredClassifiedView;
});