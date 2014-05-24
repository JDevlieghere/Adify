define([
    'jquery',
    'underscore',
    'backbone',
    'models/ClassifiedModel',
    'models/MessageModel',
    'text!/tpl/send_email.html'
], function($, _, Backbone,ClassifiedModel, MessageModel, template){

    var SendEmailView = Backbone.View.extend({

        el: $("#view"),

        events: {
            'submit form': 'send'
        },

        initialize: function(options){
           this.classifiedModel =  options.classifiedModel;
            this.render();

            this.classifiedModel.on('sync', this.render, this);

        },



        send: function(event){
            event.preventDefault();
            var email = this.$('#message-contact').val();
            var subject = this.$('#message-subject').val();
            var text = this.$('#message-content').val();
            var email2 = "stefanpante@outlook.com";
            console.log('send email');
            var messageModel = new MessageModel({
                email: email,
                email2: email,
                subject: subject,
                text: text
            });

            messageModel.save();
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

            this.$('#btn-send').bind('click', function(){
                that.send();
            })
        }
    });

    return SendEmailView;

});