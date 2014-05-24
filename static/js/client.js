'use strict';

anr.Client = class {
    constructor () {
        this.msg = 'test client';
    }
    start () {
        console.log(this.msg);
        let c = new WebSocket(`ws://${window.location.hostname}:8080`);
        c.onopen = () => c.send('prout ma chère');
        c.onmessage = (msg) => console.log('received: ' + JSON.parse(msg.data).yopla);
    }
};

