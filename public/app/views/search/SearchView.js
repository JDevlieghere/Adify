define([
    'jquery',
    'underscore',
    'backbone',
    'collections/ClassifiedCollection',
    'views/search/SearchItemView',
    'views/search/SearchPlaceItemView',
    'text!/templates/search.html'
], function ($, _, Backbone, ClassifiedCollection, SearchItemView, SearchPlaceItemView, template) {

    var SearchView = Backbone.View.extend({


        el: $('#search'),

        events:{
            'click #close-search-result' : 'closeSearchResult'
        },

        initialize: function (options) {

            this.collection = options.classifiedCollection;

            var that = this;
            $('#global-search').bind('keyup', function () {
                that.search();
            });


            this.results = [];
            this.places = [];
        },


        closeSearchResult: function(){
            this.$el.html("");
            $("#global-search").val("");
        },

        setClassifiedMapView: function(classifiedMapView){
            this.classifiedMapView = classifiedMapView;
        },

        search: function() {
            var query = $('#global-search').val();
            query = query.toLowerCase();
            this.searchAdvertisements(query);
        },

        searchAdvertisements: function (query, callback) {
            if (query.length >= 1) {
                this.results = this.collection.filter(function (classified) {
                    var str1 = classified.attributes.title.toLowerCase();
                    var index = str1.indexOf(query);
                    if (index > -1) {
                        return true;
                    }
                    return false;
                });
            }else{
                this.results = [];
            }

            if (this.results.length < 1) {
                this.$el.html("");
            }
            this.render();

        },

        render: function () {

            var compiledTemplate = _.template(template);
            var width = $('#global-search-group').width();
            var height = $('#global-search-group').height();
            var offset = $('#global-search-group').offset();
            var top = offset.top + height + 13;
            var left = offset.left;


            this.$el.html(compiledTemplate);
            this.$('#search-result').css({width: width, top: top, left: left});

            if(this.results.length == 0){
                $(".cla-result").hide();
            }else{
                $(".cla-result").show();
                _.each(this.results, function (classified) {

                    var searchItemView = new SearchItemView(
                        {
                            model: classified,
                            classifiedMapView: this.classifiedMapView
                        });

                    this.$('.search-result-list.cla-result').append(searchItemView.render().el);

                }, this);
            }

            var searchPlaceItemView = new SearchPlaceItemView(
                {
                    title: $("#global-search").val(),
                    classifiedMapView: this.classifiedMapView
                });
            this.$('.search-result-list.places-result').append(searchPlaceItemView.render().el);
        }

    });

    return SearchView;
});