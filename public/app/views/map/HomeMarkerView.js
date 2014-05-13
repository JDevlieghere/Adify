define([
    'underscore',
    'backbone',
], function(_, Backbone) {
    var HomeMarkerView = Backbone.View.extend({

        initialize: function () {
            var latLng = this.model.getLatLng();
            var marker = new google.maps.Marker({
                position: latLng,
                icon: 'http://adify.be/img/markers/house.png'

           });

           this.marker = marker;
        },

        setMap: function(map){

            this.marker.setMap(map);
            var that = this;
        },

        closeInfoBox: function () {
            this.infobox.close();
        },

        render: function () {
        },

        remove: function () {
            this.marker.setMap(null);
            this.marker = null;
        }
    });

    return HomeMarkerView;

});