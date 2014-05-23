var express = require('express');
var ws = require('ws');

var app = express();


app.use(express.static(__dirname + "/../public")); 

app.get('/', function(req, res) {
    res.redirect('netrunner.html');
});


app.listen(3000);

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 8080});
wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log('received: %s', message);
    });
    ws.send('something');
});

