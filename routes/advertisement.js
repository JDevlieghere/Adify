
/*
 * GET Advertisements by title.
 */
exports.get = function(db){
    return function(req, res){
        db.collection('advertisements').find().toArray(function (err, items) {
            res.json(items);
        });
    }
};

exports.post = function(db){
    return function(req, res){
        var advertisement = {
            user: req._passport.session.user._json.name,
            owner: req._passport.session.user._json.id,
            title : req.body.title,
            description : req.body.description,
            img: req.body.img,
            stars: [],
            address: req.body.address,
            contact: req.body.contact,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        };
        db.collection('advertisements').insert(advertisement, function(err) {
            if(err){
                res.json({success: err.message});
            }else{
                res.json({success: true});
            }
        });
    };
};


exports.delete = function(db, helper) {
    return function (req, res) {
        var id = req.params.id;
        var owner = req._passport.session.user._json.id;
        db.collection('advertisements').remove({'_id': helper.toObjectID(id), 'owner': owner}, {safe: true}, function (err, result) {
            if (err) {
                res.send(500);
            } else {
                res.send(200);
            }
        });
    };
};

exports.put = function(db, helper){
    return function (req, res) {
        var owner = req._passport.session.user._json.id;
        var id = helper.toObjectID(req.params.id);
        var advertisement = {
            title : req.body.title,
            description : req.body.description,
            img: req.body.img,
            address: req.body.address,
            contact: req.body.contact,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        };
        db.collection('advertisements').update({_id: id, owner: owner}, {$set: advertisement}, function(err) {
            if(err) {
                if (err) {
                    res.send(500);
                } else {
                    res.send(200);
                }
            }
        });
    }
};

exports.findByMe = function(db){
    return function(req, res){
        console.log("Find all my advertisements");
        var owner = req._passport.session.user._json.id;
        db.collection('advertisements').find({'owner': owner}).toArray(function (err, items) {
            res.json(items);
        });
    }
};

