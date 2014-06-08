/*jslint node: true */
'use strict';

let terminal_logger = require('../common/logger.js'),
    utils = require('../common/utils.js');

//-----------------------------------------------------------------------------
class ANRSocket {
    constructor (socket, logger) {
        this.socket = socket;
        this.id = utils.uniqueId();
        this.logger = logger || terminal_logger;
        this.logger.info(`New web socket open, with id ${this.id}`);
        socket.on('close', () => this.logger.info(`Connection closed: socket ${this.id}`));
        socket.on('message', msg => this.logger.info(`[${this.id}, ▲] ${msg}`));
    }
    write (msg) {
        let msg_out = JSON.stringify({
            id: utils.uniqueId(),
            type: msg.type,
            content: msg.content,
            answer: msg.answer,
        });
        this.logger.info(`[${this.id}, ▼] ${msg_out}`);
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

module.exports = ANRSocket;