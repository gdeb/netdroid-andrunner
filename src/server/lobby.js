/*jslint node: true */
'use strict';

let logger = require('../common/logger.js'),
    Model = require('../common/model.js'),
    utils = require('../common/utils.js');

//-----------------------------------------------------------------------------
class Lobby {
    constructor (client) {
        this.client = client;
        this.model = new Model();
        this.model.add_property('players', 'list');
        this.model.add_property('chat', 'list');

        this.model.on('add:players', this.broadcast_new_player.bind(this));
        // this.model.on('remove:players', this.remove_player.bind(this));
    }

    login (msg, player) {
        let name = this.get_unique_name(msg.content);

        player.set_name(name);

        player.on_message(msg => this.handle_message(msg, player));
        // player.on_close(() => this.remove_player(player));

        this.model.players.add(player);

        let players = this.model.players.get().map(p => ({name:p.name})),
            response = {name: player.name, users_list: players};
        player.send('login_successful', response, msg);
    }

    broadcast_new_player (event) {
        for (let p of this.model.players.get()) {
            if (p !== event.new_value) {
                p.send('new_player', {name: event.new_value.name});
            }
        }        
    }

    get_unique_name (name, suffix = 0) {
        let test_name = suffix > 0 ? name + suffix : name,
            name_list = this.model.players.get().map(p => p.name),
            is_unique = name_list.indexOf(test_name) === -1;

        return is_unique ? test_name : this.get_unique_name(name, suffix + 1);
    }

    handle_message (msg, player) {
        // to do
        // logger.debug('handle_message');
    }

    remove_player (event) {
        let player = event.removed;
        logger.debug(event);
        logger.info(`Player ${player.name} left the lobby`);
        for (let p of this.model.players.get()) {
            p.send('player_disconnect', {name: player.name});
        }
    }
}
module.exports = Lobby;