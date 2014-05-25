/*jslint node: true */
'use strict';

//-----------------------------------------------------------------------------
class Lobby {
    constructor (client) {
        this.client = client;
    }

    add_player (msg, socket) {
        console.log('in lobby');
        console.log(msg);
        socket.send(JSON.stringify({test:'bliprst'}));
        socket.send(JSON.stringify({test:'yoplablip'}));
    }
}
module.exports = Lobby;