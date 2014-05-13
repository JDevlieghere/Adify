define([
    'jquery',
    'underscore',
    'backbone',
    'text!/tpl/starred_classifieds_item.html'
], function($, _, Backbone, template){


    var ClassifiedListView = Backbone.View.extend({

        tagName: 'tr',

        initialize: function(){
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.remove, this);
        },

        events: {
            'click .event-star': 'StarClassified'
        },

        StarClassified: function(){
            this.model.destroy();
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

    return ClassifiedListView;
});