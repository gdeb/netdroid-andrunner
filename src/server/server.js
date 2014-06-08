/*jslint node: true */
'use strict';

let express = require('express'),
    logger = require('../common/logger.js'),
    WebSocketServer = require('ws').Server,
    Player = require('./player.js'),
    Lobby = require('./lobby.js');


//-----------------------------------------------------------------------------
class Server {
    constructor () {
        this.lobby = new Lobby(this);

        // http server
        this.app = express();
        this.app.use(express.static(`${__dirname}/../../static`)); 
        this.app.get('/', (_, res) => res.redirect('netrunner.html'));

        // web socket server
        this.socket_server = new WebSocketServer({port:8080});
        this.socket_server.on('connection', s => this.handle_connection(s));

        logger.info('Server started: http://localhost:3000');
        this.app.listen(3000, '0.0.0.0');
    }

    handle_connection (socket) {
        logger.info('Incoming connection');
        let player = new Player(socket);
        player.on_next_message(msg => this.lobby.add_player(msg, player));
    }
}

//-----------------------------------------------------------------------------
module.exports = Server;