var fs = require("fs");
var gm = require('gm');

var image_root = "./public/uploads/";
var max_width = 760;
var thumb_width = 300;
var thumb_dir = 'thumbs/';

exports.index = function(req, res){
    res.render('test');
};


exports.upload = function(formidable){
    return function(req, res){
        var form = new formidable.IncomingForm();
        form.on('file', function(field, file) {
            if(file.type.indexOf('image') != -1){
                var imageName = randString() + file.name;
                var newPath = image_root + imageName;
                fs.rename(file.path, newPath, function (err) {
                    if(err){
                        console.log(err.message);
                        res.end();
                    }else{
                        resize(imageName);
                        res.json({success: true, name:imageName});
                    }
                });
            }else{
                res.json({success: false});
            }
        });
        form.parse(req);
    };
};

function randString(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function resize(name){
    var full_path = image_root + name;
    var thumb_path = image_root + thumb_dir + name;
    gm(full_path).resize(max_width).write(full_path, function (err) {
        if (err) console.log(err.message);
    });
    gm(full_path).resize(thumb_width).write(thumb_path, function (err) {
        if (err) console.log(err.message);
    });
}