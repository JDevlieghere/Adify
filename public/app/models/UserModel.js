define([
    'underscore',
    'backbone',
], function(_, Backbone) {

    var UserModel = Backbone.Model.extend({

        idAttribute: "_id",
        url: '/api/profile',

        default:{
            address: '',
            contact: '',
            latitude: 50.87945,
            longitude: 4.7014,
            user_id: ''
        },

        initialize: function(){},

        getLatLng: function(){
            var latLng = new google.maps.LatLng(this.get("latitude"), this.get("longitude"));
            return latLng;
        }

    });

    return UserModel;
});