define([
    'jquery',
    'underscore',
    'backbone',
    'text!/tpl/announcement.html'
], function($, _, Backbone, template){

    var AnnouncementView = Backbone.View.extend({

        el: $("#view"),

        events:{
            'click #overlay' : 'close',
            'click #close-a' : 'close2'
        },

        render: function(){
            var compiledTemplate = _.template(template);
            this.$el.removeClass('hidden');
            this.$el.html(compiledTemplate);

            var that = this;

            this.$('.contentbox').bind('click', function(event){
                event.stopPropagation();
            });

        },


        close2: function(event){
            console.log(event.target);
            this.close();
        }
    });

    return AnnouncementView;

});