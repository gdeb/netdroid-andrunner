'use strict';

anr.Client = class {
    constructor () {
        this.web_socket = new WebSocket(`ws://${window.location.hostname}:8080`);
        this.controller = new anr.controllers.Lobby();
    }
    start () {
        let self = this;
        this.web_socket.onopen = function () {
            self.web_socket.send('msg1');
            self.web_socket.send('msg2');
            self.web_socket.send('msg3');
        };
        this.web_socket.onmessage = function (msg) {
            self.web_socket.onmessage = self.controller.read;
            self.controller.connect(msg, self.web_socket);
        };
    }
};

