/*jslint node: true */
'use strict';

let express = require('express'),
    WebSocketServer = require('ws').Server;

//-----------------------------------------------------------------------------
class Server {
    constructor () {
        this.app = express();
        this.app.use(express.static(`${__dirname}/../public`)); 
        this.app.get('/', (_, res) => res.redirect('netrunner.html'));

        this.socket_server = new WebSocketServer({port:8080});
        this.socket_server.on('connection', this.add_connection.bind(this));
    }
    start () {
        console.log('Server started: http://localhost:3000');
        this.app.listen(3000);
    }

    add_connection (socket) {
        console.log('Incoming connection');
        socket.on('message', msg => console.log(`Received: ${msg}`));
        socket.send(JSON.stringify({yopla:'hello'}));
    }
}

//-----------------------------------------------------------------------------
module.exports = Server;