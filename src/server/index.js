/*jslint node: true */
'use strict';

var express = require('express'),
    logger = require('../logger'),
    fs = require('fs'),
    Mustache = require('mustache');




var app = express();

app.use(express.static('.tmp/')); 


function send_view(res, template, context) {
    var file = "views/" + template;
    fs.readFile(file, function (err, data) {
        if (err) throw err;
        res.send(Mustache.render(data.toString(), context));
    });
}

app.get('/', function(req, res){
    send_view(res, 'index.html', {});
});

app.get('/index.html', function (req, res) {
    send_view(res, 'index.html', {});
});

app.get('/login.html', function (req, res) {
    send_view(res, 'login.html', {});
});


app.listen(process.env.PORT || 8080);

logger.info('server started');

// var view = {
//   title: "Joe",
//   calc: function () {
//     return 2 + 4;
//   }
// };

// var output = Mustache.render("{{title}} spends {{calc}}", view);
// console.log(output);
