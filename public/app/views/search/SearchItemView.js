define([
    'jquery',
    'underscore',
    'backbone',
    'text!/tpl/search_result_item.html'
], function($, _, Backbone, template){


    var SearchItemView = Backbone.View.extend({

        tagName: 'li',

        initialize: function(options){
            this.classifiedMapView = options.classifiedMapView;
        },

        events: {
            'click .search-result-item' : 'showSearchResult'
        },

        showSearchResult: function(){
            var id = this.model.attributes._id;
            Backbone.history.navigate('cla/' + id, true);
        },

        render: function(){
            var compiledTemplate = _.template(template, this.model.toJSON());
            this.$el.html(compiledTemplate);
            return this;
        }
    });

    return SearchItemView;
});