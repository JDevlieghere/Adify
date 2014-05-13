define([
    'underscore',
    'backbone'
], function(_, Backbone) {

    var ClassifiedModel = Backbone.Model.extend({

        idAttribute: "_id",

        urlRoot: function() {
            return '/api/classifieds';
        },

        defaults:{
            user: '',
            owner: '',
            title:'',
            description:'',
            img:'',
            address: '',
            contact: '',
            latitude: 0,
            longitude: 0,
            starred: false
        },

        getLatLng: function () {
            var latLng = new google.maps.LatLng(this.get("latitude"), this.get("longitude"));
            return latLng;
        }
    });

    return ClassifiedModel;
});