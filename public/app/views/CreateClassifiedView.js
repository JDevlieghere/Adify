define([
    'jquery',
    'underscore',
    'backbone',
    'models/ClassifiedModel',
    'text!/tpl/create_classified.html'
], function($, _, Backbone, ClassifiedModel, template){

    var HomeView = Backbone.View.extend({

        el: $("#view"),

        events: {
            'click #btn-create': 'createClassified',
            'click .cla-image': 'openFileDialog',
            'click #look-up': 'lookupAddress',
            'change #upload': 'uploadImage',
            'click #btn-user-contact': 'fillInContact',
            'click #btn-user-addr': 'fillInAddr',
            'click #overlay' : 'close'

        },

        initialize: function(options){
            this.user = options.userModel;
            this.classifiedCollection = options.classifiedCollection;
        },

        createClassified: function (ev, target) {
            var that = this;
            this.lookupAddress(ev, function(){
                var data = {
                    title:$('#ad-title').val(),
                    description:$('#ad-desc').val(),
                    img:$('#image-name').val(),
                    address:$('#user-addr').val(),
                    contact:$('#user-contact').val(),
                    latitude:$('#latitude').val(),
                    longitude:$('#longitude').val()
                };
                var classifiedModel = new ClassifiedModel(data);

                classifiedModel.save(null,{
                    dataType: 'text',
                    success: function(model,response,options) {
                        that.classifiedCollection.add(model);
                        that.close();
                        analytics.track('Classified Created', data);
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
                    icon: 'img/markers/ad.png',
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

        fillInContact: function(){
            var profile = this.user.toJSON();
            this.$("input#user-contact").val(profile.contact);
        },

        fillInAddr: function(){
            var profile = this.user.toJSON();
            this.$("input#user-addr").val(profile.address);
        },

        openFileDialog: function(){
            $('#upload').click();
        },

        uploadImage: function(){
            var formData = new FormData(this);
            formData.append("file", $('input#upload').get(0).files[0]);
            NProgress.start();
            $.ajax({
                url: "/img/upload",
                data: formData,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function(data) {
                    if(data.success){
                        var imgUrl = 'http://adify.be/uploads/' + data.name;
                        $('#image-name').val(data.name);
                        $('.cla-image').css({'background-image': 'url('+imgUrl+')'});
                        $('.upload-plus').fadeOut(200);
                    }else{
                        new Error('Unable to upload image.');
                    }
                },
                error: function(err){
                    new Error(err);
                },
                complete: function(){
                    NProgress.done();
                }

            });
        },

        render: function(){
            var compiledTemplate = _.template(template);
            this.$el.html(compiledTemplate);

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

            this.$('.cla-image').bind('click',function(event){
               that.openFileDialog();
               event.stopPropagation();
            });

            this.$('#look-up').bind('click',function(event){
                that.lookupAddress();
                event.stopPropagation();
            });

            this.$('#btn-user-contact').bind('click',function(event){
                that.fillInContact();
                event.stopPropagation();
            });

            this.$('#btn-user-addr').bind('click',function(event){
                that.fillInAddr();
                event.stopPropagation();
            });


            this.$('#btn-create').bind('click',function(event){
                that.createClassified(event, that);
                event.stopPropagation();
            });

            this.$('.contentbox').bind('click', function(event){
                //event.target.click();
                event.stopPropagation();
            });



        }
    });

    return HomeView;

});