/*jslint node: true */
'use strict';

//-----------------------------------------------------------------------------
class EventEmitter{
    constructor () {
        this._callbacks = {};
        this._once_callbacks = {};
    }
    addListener (event_name, callback) {
        this._callbacks[event_name] = this._callbacks[event_name] || [];
        this._callbacks[event_name].push(callback);
        return this;
    }
    emit (event_name, ...data) {
        let callbacks = this._callbacks[event_name] || [];
        let once_callbacks = this._once_callbacks[event_name] || [];
        for (let callback of callbacks) {
            callback(...data);
        }
        for (let callback of once_callbacks) {
            callback(...data);
        }
        delete this._once_callbacks[event_name];
        return this;
    } 
    once (event_name, callback) {
        this._once_callbacks[event_name] = 
                this._once_callbacks[event_name] || [];
        this._once_callbacks[event_name].push(callback);
        return this;        
    }
}
EventEmitter.prototype.on = EventEmitter.prototype.addListener;

module.exports = EventEmitter;

