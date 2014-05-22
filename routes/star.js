exports.get = function(db){
    return function(req, res){
        var user_id = req._passport.session.user._json.id.toString();
        db.collection('stars').find({user_id: user_id}).toArray(function (err, items) {
            res.json(items);
        });
    }
};

exports.post = function(db){
    return function(req,res){
        var user_id = req._passport.session.user._json.id.toString();
        var json ={
          'cla_id': req.body.cla_id,
          'user_id': user_id,
          'title': req.body.title
        };
        db.collection('stars').insert(json, function(err) {
            if (err) {
                res.send(500);
            } else {
                res.send(200);
            }
        });
    }
};

exports.delete = function(db, helper) {
    return function (req, res) {
        var id = req.params.id;
        var user_id = req._passport.session.user._json.id.toString();
        db.collection('stars').remove({_id: helper.toObjectID(id), user_id: user_id}, {safe: true}, function (err, result) {
            if (err) {
                res.send(500);
            } else {
                res.send(200);
            }
        });
    };
};
