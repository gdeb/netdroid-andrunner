/*jslint node: true */
'use strict';

let express = require('express'),
    logger = require('./logger.js'),
    WebSocketServer = require('ws').Server,
    Lobby = require('./lobby.js');

//-----------------------------------------------------------------------------
class Server {
    constructor () {
        let self = this;
        this.lobby = new Lobby(this);

        // http server
        this.app = express();
        this.app.use(express.static(`${__dirname}/../public`)); 
        this.app.get('/', (_, res) => res.redirect('netrunner.html'));

        // web socket server
        this.socket_server = new WebSocketServer({port:8080});
        this.socket_server.on('connection', function (socket) {
            logger.info('Incoming connection');
            socket.once('message', msg => self.lobby.add_player(msg, socket));
        });
    }
    start () {
        logger.info('Server started: http://localhost:3000');
        this.app.listen(3000);
    }
}

//-----------------------------------------------------------------------------
module.exports = Server;