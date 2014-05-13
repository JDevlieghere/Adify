define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone){

    var HomeView = Backbone.View.extend({

        el: $("#view"),

        render: function(){
            //this.$el.addClass('hidden');

            this.$('.contentbox').bind('click', function(event){
                event.stopPropagation();
            });

            this.$("#overlay").bind('click', function(){
                console.log('overlay clicked');
                that.close();
            });
        }
    });

    return HomeView;

});