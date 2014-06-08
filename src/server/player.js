/*jslint node: true */
'use strict';

let logger = require('../common/logger.js'),
    utils = require('../common/utils.js');


//-----------------------------------------------------------------------------
class Player {
    constructor (socket, opt_logger) {
        this._socket = socket;
        this.id = utils.uniqueId();
        this.name = undefined;

        logger = opt_logger || logger;
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
        this._socket.send(msg_out);
    }
    send (type, content, answered_msg) {
        this.write({
            type: type, 
            content:content, 
            answer: answered_msg && answered_msg.id,
        });
    }
    on_next_message(callback) {
        this._socket.once('message', msg => callback(JSON.parse(msg)));
    }
    on_message(callback) {
        this._socket.on('message', msg => callback(JSON.parse(msg)));
    }
    on_close(callback) {
        this._socket.on('close', callback);
    }
}

module.exports = Player;