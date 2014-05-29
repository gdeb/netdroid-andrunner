/*jslint node: true */
'use strict';

let logger = require('./logger.js'),
    utils = require('./utils.js');

//-----------------------------------------------------------------------------
class Player {
    constructor (name, socket) {
        this.name = name;
        this.socket = socket;
    }
    send (...args) {
        this.socket.send(...args);
    }
}

//-----------------------------------------------------------------------------
class Lobby {
    constructor (client) {
        this.client = client;
        this.players = [];
    }

    add_player (msg, socket) {
        let name = this.get_unique_name(msg.content),
            player = new Player(name, socket);

        this.players.push(player);

        socket.on_message(msg => logger.debug('received socket msg', msg));
        player.send('login_successful', {name:player.name, users_list:[{name:'anonymous'}]}, msg);
    }

    get_unique_name (name, suffix = 0) {
        let test_name = suffix > 0 ? name + suffix : name,
            name_list = this.players.map(p => p.name),
            is_unique = name_list.indexOf(test_name) === -1;
        return is_unique ? test_name : this.get_unique_name(name, suffix + 1);
    }
}
module.exports = Lobby;