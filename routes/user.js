
/*
 * GET users listing.
 */

exports.list = function(db){
    return function(req, res){
        db.collection('profiles').find().toArray(function (err, items) {
            res.json(items);
        })
    }
};

exports.me = function(db){
    return function(req, res){
        if(req._passport.session.user){
            var user = req._passport.session.user._json.id.toString();
            db.collection('profiles').findOne({_id: user}, function(err, item) {
                if(err) {
                    res.send(404);
                }else{
                    res.json(item);
                }
            })
        }else{
            res.json(401);
        }
    }
};

exports.findOrCreate = function(db, profile){

    db.collection('profiles').findOne({_id: profile.id}, function(err, item) {
        if(item == null){
            var newProfile = {
                "_id": profile.id,
                "name": profile._json.name,
                "address" : null,
                "contact": null,
                "latitude": null,
                "longitude": null
            };
            db.collection('profiles').insert(newProfile, function(err) {
                if(err){
                    console.log('Profile creation failed.');
                }
            });
        }
    });
};

exports.update = function(db){
    return function(req, res){
        var user = req._passport.session.user._json.id.toString();
        var addr = req.body.address;
        var contact = req.body.contact;
        var lat = req.body.latitude;
        var lng = req.body.longitude;
        db.collection('profiles').update({user_id:user}, {$set:{address:addr, contact:contact, latitude:lat, longitude:lng}}, function(err) {
            if(err){
                res.send(500);
            }else{
                res.send(200);
            }
        });
    }
};