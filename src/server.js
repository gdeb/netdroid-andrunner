/*jslint node: true */
'use strict';

let express = require('express'),
    logger = require('./logger.js'),
    utils = require('./utils.js'),
    WebSocketServer = require('ws').Server,
    Lobby = require('./lobby.js');

//-----------------------------------------------------------------------------
class Server {
    constructor () {
        this.lobby = new Lobby(this);

        // http server
        this.app = express();
        this.app.use(express.static(`${__dirname}/../public`)); 
        this.app.get('/', (_, res) => res.redirect('netrunner.html'));

        // web socket server
        this.socket_server = new WebSocketServer({port:8080});
        this.socket_server.on('connection', this.handle_connection.bind(this));
    }
    start () {
        logger.info('Server started: http://localhost:3000');
        this.app.listen(3000);
    }
    handle_connection (socket) {
        let socket_id = utils.uniqueId();
        logger.info('Incoming connection: socket', socket_id);

        let old_send = socket.send.bind(socket);
        socket.send = function (data, ...args) {
            logger.info(`[${socket_id}, ▼] ${data}`);
            old_send(data, ...args);
        }
        socket.on('message', msg => logger.info(`[${socket_id}, ▲] ${msg}`));

        socket.once('message', msg => this.lobby.add_player(msg, socket));
    }
}

//-----------------------------------------------------------------------------
module.exports = Server;