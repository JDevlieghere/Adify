define([
    'underscore',
    'backbone',
    'models/StarModel',
    'text!/tpl/mini_cla.html'
], function(_, Backbone, StarModel,template) {
    var ClassifiedMarkerView = Backbone.View.extend({

        tagname: 'div',

        events:{
            'click .close-button': 'close',
            'click .mini-cla-button': 'star'
        },


        initialize: function (options) {

            var that = this;
            this.map = options.map;
            this.userModel  = options.userModel;
            this.starred = options.starred;
            var latLng = this.model.getLatLng();

            this.starred = options.starred;
            var icon = 'http://adify.be/img/markers/ad.png';
            var marker = new google.maps.Marker({
                position: latLng,
                map: this.map,
                title: this.model.attributes.title,
                icon: 'http://adify.be/img/markers/ad.png'

            });

            this.marker = marker;

            var style = 'infoBox infoBox-' + this.model.attributes._id;
            this.infobox = new InfoBox({
                content: this.el,
                closeBoxURL: '',
                boxClass: style,
                enableEventPropagation: false
            });

            google.maps.event.addListener(this.marker, 'click', function () {
                var id = that.model.attributes._id;
                Backbone.history.navigate('cla/' + id, true);
            });

            google.maps.event.addListener(this.map, 'click', function(){
                that.close();
            });

            var that = this;
            google.maps.event.addListener(this.infobox, 'domready', function () {
                if (that.model.attributes.img != null) {
                    var path = "http://adify.be/uploads/thumbs/" + that.model.attributes.img;
                    $('.infoBox-' + that.model.attributes._id).css({'background-image': 'url(' + path + ')' });
                }
            });

            this.render();



        },

        setStarred: function(starred){
            this.starred = starred;
            if(starred){
                this.marker.setIcon('http://adify.be/img/markers/ad_starred.png');
            }else{
                this.marker.setIcon('http://adify.be/img/markers/ad.png');
            }

            this.render();
        },

        star: function(){
            if(this.starred){
                this.setStarred(false);
                this.starred = false;
                this.starModel.destroy();

            }else{
                this.setStarred(true);
                this.starModel = new StarModel();
                this.starModel.save({
                    'cla_id': this.model.get('_id'),
                    'user_id': this.userModel.get('user_id'),
                    'title': this.model.get('title')
                });
            }
            this.render();

        },

        close: function(){
            this.infobox.close();
        },

        showMore: function(){

        },

        openInfoBox: function(){
            this.map.panTo(this.marker.getPosition());
            this.infobox.open(this.map, this.marker);
        },


        render: function () {
            var that = this;
            var json =  this.model.toJSON();
            json.starred = this.starred;
            var compiledTemplate = _.template(template, json);
            this.$el.html(compiledTemplate);

            this.infobox.content = this.el;
        },

        remove: function () {
            this.marker.setMap(null);
            this.marker = null;
        }
    });

    return ClassifiedMarkerView;

});