define([
    'jquery',
    'underscore',
    'backbone',
    'text!/tpl/tos.html'
], function($, _, Backbone, template){

    var TosView = Backbone.View.extend({

        el: $("#overlay"),

        render: function(){
            var compiledTemplate = _.template(template);
            this.$el.removeClass('hidden');
            this.$el.html(compiledTemplate);
        }
    });

    return TosView;

});