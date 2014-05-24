exports.send = function(mail){
    return function(req, res){

        var email = req.body.email;
        var email2 = req.body.email2;
        var subject = req.body.subject;
        var text = req.body.text;

        var mailOptions = {
            from: email,
            to: email2,
            subject: subject,
            text: text
        };

        console.log("sending email");
        mail(mailOptions);
    }
};