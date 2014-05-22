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
            this.title = options.title;
            this.searchView = options.searchView;
        },

        events: {
            'click .search-result-item' : 'showSearchResult'
        },

        showSearchResult: function(){
            this.searchView.closeSearchResult();
            this.classifiedMapView.panToLocation(this.title);
        },

        render: function(){

            var title = 'Search Google maps for "' + this.title +'"'
            var json = {
                _id: '',
                title: title
            };
            var compiledTemplate = _.template(template, json);
            this.$el.html(compiledTemplate);
            return this;
        }
    });

    return SearchItemView;
});