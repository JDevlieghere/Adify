define([
    'jquery',
    'underscore',
    'backbone',
    'text!/tpl/my_classifieds_item.html'
], function($, _, Backbone, template){


    var MyClassifiedsItemView = Backbone.View.extend({

        tagName: 'tr',

        initialize: function(){
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.remove, this);
        },

        events: {
            'click .event-delete' : 'delete',
            'click .event-edit': 'edit'
        },

        delete: function(){
            var confirmed = confirm("Are you sure you want to delete \"" + this.model.attributes.title + "\"?");
            if(confirmed){
                this.model.destroy();
            }
        },


        edit: function() {
            var title = prompt("Enter a new title.", this.model.attributes.title);
            if(title){
                this.model.save({title: title});
            }
        },

        remove: function(){
            this.$el.remove();
        },

        render: function(){
            var compiledTemplate = _.template(template, this.model.toJSON());
            this.$el.html(compiledTemplate);
            return this;
        }
    });

    return MyClassifiedsItemView;
});