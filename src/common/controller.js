/*jslint node: true */
'use strict';

//-----------------------------------------------------------------------------
module.exports = class Controller {
    constructor (client) {
        this.client = client;
    }
    read (msg) { // from web_socket
        console.log('controller', msg);
    }
    send (msg) {
        this.client.web_socket.send(JSON.stringify(msg));
    }    
};

