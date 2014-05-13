require.config({
    paths: {
        jquery: "../js/libs/jquery/dist/jquery.min",
        underscore: "../js/libs/underscore/underscore",
        backbone: "../js/libs/backbone/backbone",
        ejs: "../js/libs/ejs/ejs.min",
        text: "../js/libs/requirejs-text/text",
        templates: "../templates",
        maps: "http://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyDcaabfNg07eSRW7lq6tii2vrvRURgq27M&sensor=false",
        infoBox: "../js/infobox.js"
    }
});

require([
    'app'
], function(App){
    // The "app" dependency is passed in as "App"
    // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
    App.initialize();
});