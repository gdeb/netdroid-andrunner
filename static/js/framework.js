'use strict';

let anr = {
    framework: {},
    models: {},
    views: {},
    controllers: {},
};

anr.framework.EventEmitter = class {
    constructor () {
        this.callbacks = {};
    }
    addListener (event_name, callback) {
        this.callbacks[event_name] = this.callbacks[event_name] || [];
        this.callbacks[event_name].push(callback);
        return this;
    }
    emit (event_name, ...data) {
        let callbacks = this.callbacks[event_name];
        if (!callbacks) return this;
        for (let callback of callbacks) {
            callback(...data);
        }
        return this;
    }    
};

anr.framework.Model = class {
    constructor () {

    }
};

anr.framework.View = class {
    constructor () {

    }
};

anr.framework.Controller = class {
    constructor () {

    }
};

