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
    on_close (callback) {
        this.socket.on_close(callback);
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
        socket.on_message(msg => this.handle_message(msg, player));
        player.on_close(() => this.remove_player(player));

        let players = this.players.map(p => ({name:p.name})),
            response = {name: player.name, users_list: players};
        player.send('login_successful', response, msg);

        for (let p of this.players) {
            if (p !== player) {
                p.send('new_player', {name: player.name});
            }
        }
    }

    get_unique_name (name, suffix = 0) {
        let test_name = suffix > 0 ? name + suffix : name,
            name_list = this.players.map(p => p.name),
            is_unique = name_list.indexOf(test_name) === -1;

        return is_unique ? test_name : this.get_unique_name(name, suffix + 1);
    }

    handle_message (msg, player) {
        // to do
        // logger.debug('handle_message');
    }

    remove_player (player) {
        logger.info(`Player ${player.name} left the lobby`);
        let index = this.players.indexOf(player);
        this.players.splice(index, 1);
        for (let p of this.players) {
            p.send('player_disconnect', {name: player.name});
        }
    }
}
module.exports = Lobby;