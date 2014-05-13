define([
    'jquery',
    'underscore',
    'backbone',
    'text!/tpl/profile.html'
], function($, _, Backbone, template){

    var ProfileView = Backbone.View.extend({

        el: $("#view"),

        events: {
            'click #btn_create': 'saveProfile',
            'click #look-up': 'lookupAddress'
        },

        initialize: function(options){
            this.user = options.userModel;
        },

        saveProfile: function(ev){
            var that = this;
            this.lookupAddress(ev, function(){
                var profileData = new Object();
                profileData.address = $("input#user-addr").val();
                profileData.contact = $("input#user-contact").val();
                profileData.latitude = $("input#latitude").val();
                profileData.longitude = $("input#longitude").val();
                that.user.save(profileData, {
                    dataType: 'text',
                    success: function() {
                        Backbone.history.navigate('/',true);
                    },
                    error: function(error){
                        Error(error);
                    }
                });
            });
        },

        setMarker: function(results, status, callback){
            if (status == google.maps.places.PlacesServiceStatus.OK){
                var location = results[0].geometry.location;
                this.map.panTo(location);
                $("input#latitude" ).val(location.k);
                $("input#longitude" ).val(location.A);
                $("input#user-addr").val(results[0].formatted_address);
                if(this.marker != null){
                    this.marker.setMap(null);
                }
                this.marker = new google.maps.Marker({
                    position: location,
                    icon: 'img/markers/house.png',
                    title: 'Home'
                });
                this.marker.setMap(this.map);
                if(callback)
                    callback();
            }
        },

        lookupAddress: function(ev, callback){
            var input = $('#user-addr').val();
            if(input != "" && input != "Street" && this.map) {
                var request = {
                    location: this.map.getCenter(),
                    radius: '1500',
                    query: input
                };
                var that = this;
                this.service.textSearch(request, function (results, status) {
                    that.setMarker(results, status, callback);
                });
            }
        },

        render: function(){
            var profile = this.user.toJSON();
            var compiledTemplate = _.template(template);
            this.$el.removeClass('hidden');
            this.$el.html(compiledTemplate);
            this.$("input#user-contact").val(profile.contact);
            this.$("input#user-addr").val(profile.address);

            var lat = new google.maps.LatLng(50.87945, 4.7014);
            var mapOptions = {
                zoom: 16,
                center: lat,
                disableDefaultUI: true,
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_BOTTOM
                }
            };

            this.map = new google.maps.Map(document.getElementById('mini-map'), mapOptions);
            this.service = new google.maps.places.PlacesService(this.map);

            var that = this;
            this.$('.contentbox').bind('click', function(event){
                event.stopPropagation();
            });

            this.$("#overlay").bind('click', function(){
                console.log('overlay clicked');
                that.close();
            });
        }
    });

    return ProfileView;

});