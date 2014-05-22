define([
    'jquery',
    'underscore',
    'backbone',
    'text!/tpl/announcement.html'
], function($, _, Backbone, template){

    var AnnouncementView = Backbone.View.extend({

        el: $("#view"),

        events:{
            'click #overlay' : 'close'
        },

        render: function(){
            var compiledTemplate = _.template(template);
            this.$el.removeClass('hidden');
            this.$el.html(compiledTemplate);

            var that = this;

            this.$('.close-a').bind('click', function(event){

            });

            this.$('.contentbox').bind('click', function(event){
                if($(event.target).attr('id') =='close-a'){
                    that.close();
                }
                event.stopPropagation();
            });



        }
    });

    return AnnouncementView;

});