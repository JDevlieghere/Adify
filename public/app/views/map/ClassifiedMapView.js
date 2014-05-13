define([
    'jquery',
    'underscore',
    'backbone',
    'collections/ClassifiedCollection',
    'collections/StarCollection',
    'views/map/ClassifiedMarkerView',
    'views/map/HomeMarkerView'
], function($, _, Backbone, ClassifiedCollection, StarCollection, ClassifiedMarkerView, HomeMarkerView) {

    var ClassifiedMapView = Backbone.View.extend({

        initialize: function(options){

            var lat = new google.maps.LatLng(50.87945, 4.7014);

            var mapOptions = {
                zoom: 16,
                center: lat,
                disableDefaultUI: true,
                zoomControl:true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_BOTTOM
                }
            };

            var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

            this.map = map;
            this.service = new google.maps.places.PlacesService(this.map);

            this.userModel = options.userModel;
            this.collection = options.classifiedCollection;
            this.starCollection = options.starCollection;

            var that = this;
            var successHandler = function(){
                that.render();
            }

            this.collection.on('sync', this.render, this);
            this.userModel.on('sync', this.render, this);
            this.starCollection.on('sync', this.render, this);

            this.classifiedMarkerViews = {};


        },

        openClassifiedInfobox: function(id){
            var classMarkerView = this.classifiedMarkerViews[id];
            analytics.track('Classified Infobox Opened', {
                title: classMarkerView.model.attributes.title
            });
            classMarkerView.openInfoBox();
        },

        panToLocation: function(query){
            if(this.map != undefined){
                if(query) {
                    var request = {
                        location: this.map.getCenter(),
                        radius: '1500',
                        query: query
                    };

                    var that = this;
                    this.service.textSearch(request, function (results, status) {
                        if(status ==google.maps.places.PlacesServiceStatus.OK){
                            if(results.length == 0){
                                alert("No Place found for the given query");
                            }else{
                                console.log(results[0]);
                                that.map.panTo(results[0].geometry.location);
                            }

                        }else{
                            alert("No Place found for the given query");
                        }
                    });
                }
            }else{
                console.log("map is undefined");
            }
        },

        render: function(){

            // make sure that the user Model exists and that the homeMarkerView
            // is only added once
            if(this.userModel.attributes.latitude != undefined
                && this.userModel.attributes.longitude != undefined
                && this.homeMarkerView == undefined){

                var lat = this.userModel.attributes.latitude;
                var long = this.userModel.attributes.longitude;
                lat = new google.maps.LatLng(lat, long);
                this.map.panTo(lat);

                this.homeMarkerView = new HomeMarkerView({model: this.userModel});
                this.homeMarkerView.setMap(this.map);
            }

            var that = this;
            console.log("number of ads:" + this.collection.length);
            this.collection.each(function(classified){
                var id = classified.attributes._id;
                // make sure that each marker is only added once.
                var classifiedMarkerView = null;
                if(!that.classifiedMarkerViews[id]){
                    classifiedMarkerView = new ClassifiedMarkerView(
                        {
                            model: classified,
                            userModel: that.userModel,
                            map: that.map

                        });
                    that.classifiedMarkerViews[id] = classifiedMarkerView;
                }else{
                    classifiedMarkerView = that.classifiedMarkerViews[id];
                }

                if(that.userModel.get('_id')){
                    var result = _.find(that.starCollection.models, function(model){
                        return model.get('cla_id') == classified.get('_id');
                    });

                    if(result){
                        classifiedMarkerView.setStarred(true);
                    }
                }



            });
        }
    });

    return ClassifiedMapView;
});

