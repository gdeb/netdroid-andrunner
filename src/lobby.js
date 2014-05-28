/*jslint node: true */
'use strict';

//-----------------------------------------------------------------------------
class Player {
    constructor (name, socket) {
        this.name = name;
        this.socket = socket;
    }
    send (msg) {
        this.socket.send(JSON.stringify(msg));
    }
}

//-----------------------------------------------------------------------------
class Lobby {
    constructor (client) {
        this.client = client;
        this.players = [];
    }

    add_player (msg, socket) {
        let player = new Player('yop', socket);

        this.players.push(player);

        socket.on('message', function (msg) {
            console.log('received socket msg', msg);
        });
        player.send({
            id:0,
            answer:0,
            type: 'login_successful',
            content: {name:'yop', users_list:[{name:'anonymous'}]}
        });
        player.send({encore:'nnrst'});
    }
}
module.exports = Lobby;