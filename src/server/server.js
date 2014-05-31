/*jslint node: true */
'use strict';

let express = require('express'),
    logger = require('./logger.js'),
    utils = require('../common/utils.js'),
    WebSocketServer = require('ws').Server,
    Lobby = require('./lobby.js');

//-----------------------------------------------------------------------------
class ANRSocket {
    constructor (socket) {
        this.socket = socket;
        this.id = utils.uniqueId();
        logger.info(`New web socket open, with id ${this.id}`);
        socket.on('close', () => logger.info(`Connection closed: socket ${this.id}`));
        socket.on('message', msg => logger.info(`[${this.id}, ▲] ${msg}`));
    }
    write (msg) {
        let msg_out = JSON.stringify({
            id: utils.uniqueId(),
            type: msg.type,
            content: msg.content,
            answer: msg.answer,
        });
        logger.info(`[${this.id}, ▼] ${msg_out}`);
        this.socket.send(msg_out);
    }
    send (type, content, answered_msg) {
        this.write({
            type: type, 
            content:content, 
            answer: answered_msg && answered_msg.id,
        });
    }
    on_next_message(callback) {
        this.socket.once('message', msg => callback(JSON.parse(msg)));
    }
    on_message(callback) {
        this.socket.on('message', msg => callback(JSON.parse(msg)));
    }
    on_close(callback) {
        this.socket.on('close', callback);
    }
}

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
        this.socket_server.on('connection', s => this.handle_connection(s));
    }
    start () {
        logger.info('Server started: http://localhost:3000');
        this.app.listen(3000, '0.0.0.0');
    }
    handle_connection (socket) {
        let anr_socket = new ANRSocket(socket);
        anr_socket.on_next_message(msg => this.lobby.add_player(msg, anr_socket));
    }
}

//-----------------------------------------------------------------------------
module.exports = Server;