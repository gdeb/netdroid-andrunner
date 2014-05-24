'use strict';

anr.Client = class {
    constructor () {
        this.web_socket = new WebSocket(`ws://${window.location.hostname}:8080`);
        this.controller = new anr.controllers.Lobby();
    }
    start () {
        this.web_socket.onopen = () => this.web_socket.send('prout ma chère');
        this.web_socket.onmessage = (msg) => console.log('received: ' + JSON.parse(msg.data).yopla);
    }
};

