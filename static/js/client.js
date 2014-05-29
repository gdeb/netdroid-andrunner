'use strict';



anr.Client = class {
    constructor () {
        let self = this;
        this.callbacks = {};
        this.controller = new anr.controllers.Lobby(this);

        let socket_url = `ws://${window.location.hostname}:8080`;
        this.web_socket = new WebSocket(socket_url);
        this.web_socket.onopen = function () {
            self.ask('login', 'anonymous', self.controller.connect.bind(this));
        }
        this.web_socket.onmessage = (msg) => this.read(JSON.parse(msg.data));
    }

    //-------------------------------------------------------------------------
    // web socket communication
    //-------------------------------------------------------------------------
    read (msg) {
        if (msg.hasOwnProperty('answer')) {
            let callback = this.callbacks[msg.answer];
            delete this.callbacks[msg.answer];
            callback(msg);
        } else {
            this.controller.read(msg);
        }
    }

    write (msg) {
        let id = anr.utils.uniqueId();
        let msg_out = {
            id: id,
            type: msg.type,
            content: msg.content,
        };
        this.web_socket.send(JSON.stringify(msg_out));
        return id;
    }    

    send (type, content) {
        return this.write({type:type, content: content})
    }

    ask (type, content, callback) {
        let msg_id = this.send(type, content);
        this.callbacks[msg_id] = callback;
    }
};

