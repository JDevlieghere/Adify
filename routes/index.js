
/*
 * GET home page.
 */
exports.index = function(req, res){
    var user;
    if(typeof req._passport.session.user != 'undefined') {
        user = req._passport.session.user._json;
    }else{
        user = null;
    }

    res.render('index', { user: user });
};

exports.userId = function(req, res){
    if(typeof req._passport.session.user != 'undefined') {
        res.json({user:req._passport.session.user._json.id});
    }else{
        res.json({user: null});
    }
}

exports.logout = function(req, res){
    req.logout();
    res.redirect('/');
}