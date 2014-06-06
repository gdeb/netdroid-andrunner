/*jslint node: true */
'use strict';

//-----------------------------------------------------------------------------
class EventEmitter{
    constructor () {
        this._callbacks = {};
    }
    addListener (event_name, callback) {
        this._callbacks[event_name] = this._callbacks[event_name] || [];
        this._callbacks[event_name].push(callback);
        return this;
    }
    emit (event_name, ...data) {
        // if (anr.debug) { console.log('Event emitted: ', event_name, ...data);}
        let callbacks = this._callbacks[event_name];
        if (!callbacks) return this;
        for (let callback of callbacks) {
            callback(...data);
        }
        return this;
    }    
}
module.exports = EventEmitter;

