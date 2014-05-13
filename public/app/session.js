define([
    'jquery',
    'backbone'
], function($, Backbone){

    var SessionModel = Backbone.Model.extend({

        initialize : function(){
            if(Storage && sessionStorage){
                this.supportStorage = true;
            }
        },

        get : function(key){
            if(this.supportStorage){
                var data = sessionStorage.getItem(key);
                if(data && data[0] === '{'){
                    return JSON.parse(data);
                }else{
                    return data;
                }
            }else{
                return Backbone.Model.prototype.get.call(this, key);
            }
        },

        set : function(key, value){
            if(this.supportStorage){
                sessionStorage.setItem(key, value);
            }else{
                Backbone.Model.prototype.set.call(this, key, value);
            }
            return this;
        },

        unset : function(key){
            if(this.supportStorage){
                sessionStorage.removeItem(key);
            }else{
                Backbone.Model.prototype.unset.call(this, key);
            }
            return this;
        },

        clear : function(){
            if(this.supportStorage){
                sessionStorage.clear();
            }else{
                Backbone.Model.prototype.clear(this);
            }
        }
    });

    return new SessionModel();
});