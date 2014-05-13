NProgress.start();

// The google map
var map;
var map2;
var home;
var user;

var Z_INDEX_CLASSIFIEDS = 4;
var starred_classifieds = new Array();
var classifieds = new Array();
var infoBoxes = {};
var markers = new Array();
var service;
var serviceGlobal;

var house = 'img/home.png';
var adify_ad = 'img/logo-small.png';

google.maps.event.addDomListener(window, 'load', initialize);

NProgress.done();


function exitLink(){
    NProgress.start();
}

function doAuthenticated(func){
    return $.getJSON('cla/user', function (data) {
        if(data.user === null){
            showAuthenticate();
        }else{
            func();
        }
    }).fail(function() {
        showTimeOut();
    });
}

function showAuthenticate(){
    var content = new EJS({url: 'templates/login.ejs'}).render();
    showDialog('login','Login', content);
}

function showTimeOut(){
    showDialog('timeout','Uh Oh', 'It looks like you lost connectivity...');
}

function showOverlay(){
    $('.navbar-collapse.in').collapse('hide');
    if($(".overlay").length == 0){
        $("<div class='overlay'></div>").insertAfter("#map-canvas");
        $(".overlay").click(function(event){
            $(".overlay").fadeOut(200, function(){
                $(".overlay").detach();
            });
        });
        $(".overlay").hide();
        $(".overlay").fadeIn(300);
    }
}

function closeDialog(){
    $(".overlay").fadeOut(200, function(){
        $(".overlay").detach();
    });
}

function showDialog(id, title, content){
    $(".container.content").detach();

    showOverlay();
    var data = {id: id, title: title, content: content};
    var dialog = new EJS({url: 'templates/dialog.ejs'}).render(data);

    $(".overlay").append(dialog);
    $(".contentbox").hide();
    $(".contentbox").fadeIn(300);

    // needed to prevent closure of the contentbox.
    $(".contentbox").click(function (event) {
        event.stopPropagation();
    });
}

function showAlert(success, content){
    $(".container.content").detach();

    showOverlay();
    var alert, data = {content: content};
    if(success){
        alert = new EJS({url: 'templates/alert_success.ejs'}).render(data);
    }else{
        alert = new EJS({url: 'templates/alert_danger.ejs'}).render(data);
    }

    $(".overlay").append(alert);
    $(".alertbox").hide();
    $(".alertbox").fadeIn(300);

    // needed to prevent closure of the contentbox.
    $(".alertbox").click(function (event) {
        event.stopPropagation();
    });
}

function showUpdateProfile(){
    if($('#update_profile').length == 0){
        NProgress.start();

        var content = new EJS({url: 'templates/set_profile.ejs'}).render();
        showDialog('update_profile', 'Update Profile', content);
        var latmini = new google.maps.LatLng(50.87945, 4.7014);

        var mapOptions = {
            zoom: 16,
            center: latmini,
            zoomControl:true
        };

        map2 = new google.maps.Map(document.getElementById('map-mini'),
            mapOptions);

        service = new google.maps.places.PlacesService(map2);

        $.getJSON('profile/me', function (data) {
            $('#user-addr').val(data.address);
            $('#user-contact').val(data.contact);
            lookupAddress(NProgress.done);
        });
    }
}

function showAddClassified(){
    // Checks whether there is another dialog active than the add advertisement dialog.

    if($("#add_cla").length == 0 ){

        NProgress.start();

        // prepare html
        var content = new EJS({url: 'templates/add_cla.ejs' }).render();
        showDialog('add_cla', 'Add Advertisement', content);

        // add the mini-map
        var latmini = new google.maps.LatLng(50.87945, 4.7014);
        var mapOptions = {
            zoom: 16,
            center: latmini,
            zoomControl:true
        };

        map2 = new google.maps.Map(document.getElementById('map-mini'),
            mapOptions);

        service = new google.maps.places.PlacesService(map2);
    }
    NProgress.done();
}

function lookupAddress(){
    lookupAddress(function(){});
}

function lookUp(){
    var value = $('#global-search').val();
    if(value != ""){
        var request = {
            query: value
        };

        serviceGlobal.textSearch(request, function(results, status){
            var location = results[0].geometry.location;
            map.panTo(location);
        });
    }
}
function lookupAddress(callback){
    var value1 = $('#user-addr').val();
    if( value1 != "" && value1 != "Street"){
        var request = {
            location: map2.getCenter(),
            radius: '1500',
            query: value1
        };
        service.textSearch(request, function(results, status){
            setClassifiedLocation(map2, results, status);
            callback();
        });
    }
}

function setClassifiedLocation(map, results, status){
    if (status == google.maps.places.PlacesServiceStatus.OK){
        var location = results[0].geometry.location;

        // Pan to location
        map2.panTo(location);
        // Update hidden input
        $( "input#latitude" ).val(location.k);
        $( "input#longitude" ).val(location.A);
        $("input#user-addr").val(results[0].formatted_address);

        var marker = new google.maps.Marker({
            position: location,
            icon: house,
            title:"Hello World!"
        });

        marker.setMap(map2);
    }
}

function showWatchedClassifieds(){
    showWatchedClassifieds(false);
}

function showWatchedClassifieds(forced){
    if(forced || $('#watched_cla').length == 0) {
        NProgress.start();

        $.getJSON('star/starred', function (data) {
            var content = "You have no watched ads.";
            if(data.length != 0){
                content = new EJS({url: 'templates/watched_cla.ejs' }).render({myAds: data});
            }
            showDialog('watched_cla', 'Watched Advertisements', content);


        });

        NProgress.done();
    }
}

function getWatchedClassifieds(){
    $.getJSON('star/starred', function (data) {
        return data;
    });
}

function showAnnouncement(){
    NProgress.start();
    var content = new EJS({url: 'templates/announcement'}).render();
    showDialog('announcement', null, content);
    NProgress.done();
}

function claUnwatch(cla_id){
    toggleWatch(cla_id);
    showWatchedClassifieds(true);
}

function claDelete(cla_id){
    var confirmed = confirm("Are you sure you want to remove this classified?");
    if(confirmed){
        removeClassified(cla_id);
        showMyAds(true);
    }
}

function toggleWatch(cla_id){
    NProgress.start();
    var url = 'star/toggle/' + cla_id.toString();
    $.getJSON(url, function(data) {
        NProgress.done();
    });
}

function removeClassified(cla_id){
    NProgress.start();
    var url = 'cla/delete/id/' + cla_id.toString();
    $.getJSON(url, function(data) {
        NProgress.done();
    });
}

function showMyAds(){
    showMyAds(false);
}

function showMyAds(forced){
    if(forced || $('#my_cla').length == 0){


        NProgress.start();

        $.getJSON( 'cla/find/mine', function(data) {

            //render the webpages
            var content = new EJS({url: 'templates/my_clas.ejs' }).render({myAds: data});
            showDialog('my_cla','My advertisements', content);
        });

        NProgress.done();
    }
}

function getGeoLocation(){
    var lat = null;
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(pos){
            coords = pos.coords;
            lat= new google.fmaps.LatLng(coords.latitude, coords.longitude);
            // map.panTo(lat2);
        });
    }

    return lat;
}

function setHome(latlng){
    if(home != null){
        home.setMap(null);
    }
    home = createMarker(latlng, house, 'Your home', map, 3);
    map.panTo(latlng);

}

function getClassifiedByTitle(query){
    $.json('/cla/find/title/' + query,function(data){

    })
}
function initialize() {

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

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    starred_classifieds = getWatchedClassifieds();

    // checks whether the center of the map is defined by the user.
    $.getJSON('profile/me', function(data){
        if(data == null){
            showAnnouncement();
            return;
        }
        if(data.longitude != null && data.latitude != null){
            lat = new google.maps.LatLng(data.latitude, data.longitude);
        }
        user = data;
        setHome(lat);
    });

    getClassifieds(setMarkers, map);
    serviceGlobal = new google.maps.places.PlacesService(map);

    google.maps.event.addListener(map, 'click', function(){
        console.log('trying to close the infoboxes');
        closeInfoBoxes();
    });


}


function fillAddress(){
    if(user.address != null){
        $("#user-addr").val(user.address);
    }
    else{
        var result = new EJS({url: 'templates/alert_inline_danger.ejs'}).render({content:'We dont have your home address yet , you can enter it on your profile.'});
        $(".form-addr-result").append(result);
    }
}

function fillContactInformation(){
    if(user.contact != null){
        $('#user-contact').val(user.contact);
    }
    else{
        var result = new EJS({url: 'templates/alert_inline_danger.ejs'}).render({content:"We don't have your contact information yet , you can enter it on your profile."});
        $(".form-contact-result").append(result);
    }
}

function createMarker(position, icon, title, map, index){

    var m = new google.maps.Marker({
        position: position,
        icon: icon,
        title: title,
        map: map
    });
    m.setZIndex(index);
    return m;

}

// refactor this to the get ads method
function setMarkers(map) {
    $.each(classifieds, function(){

        var position = new google.maps.LatLng(this.latitude, this.longitude);
        var marker = createMarker(position, adify_ad, this.title, map, Z_INDEX_CLASSIFIEDS );
        markers.push(marker);
        createInfoBox(this,marker,map);
    });
}

function closeInfoBoxes(){
    $.each(infoBoxes,function(){
        this.close();
    });
}


function getClassifieds(callback, argument){
    $.getJSON( 'cla/find/all', function( data ) {
        classifieds = data;
        callback(argument);
    });

}

function containsID(data, id) {
    if (data != null) {

        for (var i = 0; i < data.length; i++) {
            if (data[i].cla_id == id) {
                return true;
            }
        }
    }

    return false;
}

function createInfoBox(cla,marker,map){
    // ensure no spaces in the id.
    var id = cla._id.replace(" ", "");

    var starred = containsID(starred_classifieds,cla._id);
    var data = {id: id,title: cla.title, description: cla.description, user: cla.user, contact: cla.contact, starred: starred};
    var content = new EJS({url: 'templates/mini_cla.ejs'}).render(data);

    var style = 'infoBox infoBox-' + id;
    var infobox = new InfoBox({
        content: content,
        closeBoxURL: "",
        boxClass: style,
        enableEventPropagation: false
    });



    google.maps.event.addListener(infobox, 'domready', function(){
        if(cla.img != null ) {
            var path = 'http://adify.be/uploads/thumbs/' + cla.img;
            $('.infoBox-' + id).css({'background-image': 'url(' + path + ')'});
        }
    });

    google.maps.event.addListener(marker, 'click', function() {
        infobox.open(map,marker);
        animate_ads = false;
    });

    infoBoxes[id] = infobox;
}

function closeInfoBox(id){
    infoBoxes[id].close();
}

function uploadImage(){
    uploadStatus = false;
    $('#upload').click();
    $('#upload').change(function(){
        doUpload();
    });

}

function doUpload() {

    animateUpload();

    var formData = new FormData(this);
    formData.append("file", $('input#upload').get(0).files[0]);
    console.log(formData);

    $.ajax({
        url: "/img/upload",
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function(data) {
            if(data.success){
                uploadStatus = true;
                $('#image_name').val(data.name);
                stopAnimateUpload(data.name);
            }else{
                console.log('Unable to upload image.')
            }
        }
    });


}

function stopAnimateUpload(url) {

    $('#upload-animation').animate({width: "100%"}, 750, function () {
        $('.cla-image').css({'background-image': 'url(http://adify.be/uploads/' + url + ')'});
        $('#upload-animation').fadeOut(500, function () {
            $('.cla-image').animate()
            $('.upload-plus').fadeOut(200);
        });
    });
}

var uploadStatus = false;

function animateUpload(){
    var animation = function() {
        setTimeout(function () {
            var pwidth = $('.cla-image').css('width');
            var width = $('#upload-animation').css('width');

            width = width.replace("px", "");
            console.log('width: ' + width);
            pwidth = pwidth.replace("px", "");
            console.log('parent width: ' + pwidth);

            if (width >= pwidth || uploadStatus) {
                return;
            }
            $('#upload-animation').animate({width: "+=5%"});
            animation();

        }, 200);
    }

    animation();
}


function createClassified(){
    NProgress.start();

    var classifiedObject = new Object();
    classifiedObject.title = $("input#ad_title").val();
    classifiedObject.img = $("input#image_name").val();
    classifiedObject.description = $("textarea#ad_desc").val();
    classifiedObject.address = $("input#user-addr").val();
    classifiedObject.contact = $("input#user-contact").val();
    classifiedObject.latitude = $("input#latitude").val();
    classifiedObject.longitude = $("input#longitude").val();

    $.post("cla/add", classifiedObject).success(function(){
        showAlert(true, "Classified successfully created.");
        NProgress.done();
        var latlng = new google.maps.LatLng(classifiedObject.latitude, classifiedObject.longitude);
        createMarker(latlng,adify_ad, classifiedObject.title,map, 4);
        map.panTo(latlng);
    }).fail(function() {
        showAlert(false, "Classified could not be created.");
        NProgress.done();
    });

}

function updateProfile(){
    NProgress.start();

    var profileObject = new Object();
    profileObject.address = $("input#user-addr").val();
    profileObject.contact = $("input#user-contact").val();
    profileObject.latitude = $("input#latitude").val();
    profileObject.longitude = $("input#longitude").val();

    $.post("profile/update", profileObject).success(function(){
        console.log(profileObject);
        setHome(new google.maps.LatLng(profileObject.latitude,profileObject.longitude));
        user.latitude = profileObject.latitude;
        user.longitude = profileObject.longitude;
        user.address = profileObject.address;
        user.contact = profileObject.contact;
        showAlert(true, "Profile successfully updated.");
        NProgress.done();

    }).fail(function() {
        showAlert(false, "Profile could not be updated.");
        NProgress.done();
    });
}
