define([
    'jquery',
    'underscore',
    'backbone',
    'models/ClassifiedModel',
    'text!/tpl/send_email.html'
], function($, _, Backbone,ClassifiedModel, template){

    var SendEmailView = Backbone.View.extend({

        el: $("#view"),

        events: {
        },

        initialize: function(options){
           this.classifiedModel =  options.classifiedModel;
            this.render();

        },





        render: function(){
            var compiledTemplate = _.template(template);

            this.$el.html(compiledTemplate);


            if(this.classifiedModel){
                var json = this.classifiedModel.toJSON();

                var img_url = "url(http://adify.be/uploads/" + json.img +')';
                this.$('.cla-image').css({'background-image': img_url});
                this.$('#message-subject').val("Regarding: " + json.title);
            }
            var that = this;
            this.$('.contentbox').bind('click', function(event){
                if($(event.target).attr('id') =='close-a'){
                    that.close();
                }
                event.stopPropagation();
            });

            this.$("#overlay").bind('click', function(){
                console.log('overlay clicked');
                that.close();
            });
        }
    });

    return SendEmailView;

});