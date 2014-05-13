define([
    'underscore',
    'backbone',
    'views/HomeView',
    'views/AnnouncementView',
    'views/TosView',
    'views/my/MyClassifiedsView',
    'views/star/StarredClassifiedsView',
    'views/CreateClassifiedView',
    'views/map/ClassifiedMapView',
    'views/search/SearchView',
    'views/ProfileView',
    'models/UserModel',
    'collections/ClassifiedCollection',
    'collections/MyClassifiedsCollection',
    'collections/StarCollection',
    'session'
],function(_, Backbone, HomeView, AnnouncementView, TosView, MyClassifiedsView, StarredClassifiedsView,
           CreateClassifiedView, ClassifiedMapView,SearchView, ProfileView, UserModel, ClassifiedCollection, MyClassifiedsCollection, StarCollection, Session) {
    "use strict";

    var AppRouter = Backbone.Router.extend({
        routes: {
            "": "index",
            "_=_": "redirect",
            "welcome": "welcome",
            "tos": "tos",
            "create": "createClassified",
            "me": "myClassifieds",
            "starred": "starredClassifieds",
            "profile": "profile",
            "cla/:id": "showClassified"
        }
    });

    var currentView;

    var initialize = function(){

        Backbone.View.prototype.close = function(){
        //this.$el.fadeOut(200, function(){
            this.unbind();
            this.stopListening();
            this.undelegateEvents();
            this.$el.empty();
            Backbone.history.navigate('/', true);
        //});


        };
        
        var  userModel = new UserModel;
        userModel.fetch({
            success: (function (response) {
                if(response.attributes['401']){
                    Session.unset('user_id');
                }else{
                    Session.set('user_id', userModel.attributes.user_id);
                }
            })
        });

        var starCollection = new StarCollection();
        starCollection.fetch();

        var classifiedCollection = new ClassifiedCollection();
        classifiedCollection.fetch();


        var classifiedMapView = new ClassifiedMapView({
            userModel: userModel,
            classifiedCollection: classifiedCollection,
            starCollection: starCollection
        });

        classifiedMapView.render();

        var app_router = new AppRouter;

        app_router.on('route:redirect', function(){
            Backbone.history.navigate('/', true);
        });

        app_router.on('route:index', function(){
            var homeView = new HomeView();
            showView(homeView);
        });

        app_router.on('route:welcome', function(){
            var announcementView = new AnnouncementView();
            showView(announcementView);
        });

        app_router.on('route:createClassified', function(){
            doAuthenticated(function(){
                var createClassifiedView = new CreateClassifiedView({userModel: userModel, classifiedCollection: classifiedCollection});
                showView(createClassifiedView);
            });
        });

        app_router.on('route:myClassifieds', function(){
            doAuthenticated(function(){
                var myClassifiedsView = new MyClassifiedsView();
                showView(myClassifiedsView);
            });
        });

        app_router.on('route:starredClassifieds', function(){
            doAuthenticated(function() {
                var starredClassifiedsView = new StarredClassifiedsView({starCollection: starCollection});
                showView(starredClassifiedsView);
            });
        });

        app_router.on('route:profile', function(){
            doAuthenticated(function() {
                var profileView = new ProfileView({userModel: userModel});
                showView(profileView);
            });
        });

        app_router.on('route:tos', function(){
            var tosView = new TosView();
            showView(tosView);
        });

        app_router.on('route:showClassified', function(id){
            classifiedMapView.openClassifiedInfobox(id);
        });

        var searchView = new SearchView({classifiedCollection: classifiedCollection});
        searchView.setClassifiedMapView(classifiedMapView);


        Backbone.history.start({ pushState: true, root: '/' });

        $(document).on("click", "a:not([data-bypass])", function(evt) {
            var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
            var root = location.protocol + "//" + location.host + '/';

            if (href.prop && href.prop.slice(0, root.length) === root) {
                evt.preventDefault();
                Backbone.history.navigate(href.attr, true);
            }
        });



    };

    var doAuthenticated = function(callback){
        if(!Session.get('user_id')){
            Backbone.history.navigate("welcome", true);
        }else{
            callback();
        }
    };


    var showView = function(view){
//        if (currentView){
//            currentView.close();
//        }
        currentView = view;
        currentView.render();
        $('#overlay').hide().fadeIn(200);
    };

    return {
        initialize: initialize
    };
});