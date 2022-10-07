var fs = require('fs');
var handlebars = require('handlebars');

module.exports.passwordResetTemplete = function(data, callBack){
    fs.readFile(__dirname + '/password-reset.html', {encoding: 'utf-8'}, (err, html) => {
        if (err) {
            throw err;
        }
        else {
            var template = handlebars.compile(html);
            var replacements = {
                token : data.token,
                email : data.email
            };
            var htmlToSend = template(replacements);
            return callBack(null, htmlToSend);
        }
    });
}