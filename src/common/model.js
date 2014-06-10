/*jslint node: true */
'use strict';

let EventEmitter = require('./event_emitter.js');
// let EventEmitter = require('events').EventEmitter;

let prop = require('./properties.js');

//-----------------------------------------------------------------------------
// return true if two objects have the same keys and the same
// values (values are compared with ===)
function is_equal(obj1, obj2) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) 
        return false;
    for (let key of Object.keys(obj1)) 
        if (obj1[key] !== obj2[key]) return false;
    return true;
}

//-----------------------------------------------------------------------------
class Model extends EventEmitter {
    constructor () {
        super();
        this._properties = {};
    }

    add_property(name, type, value) {
        if (name in this) {
            throw new Error('Property already defined.');
        }
        let notifier = this.make_notifier(name);
        if (type === 'value') {
            this[name] = new prop.ValueProperty(notifier, value);
        } else if (type === 'list') {
            this[name] = new prop.ListProperty(notifier, value);
        } else if (type === 'list:dict') {
            this[name] = new prop.ListDictProperty(notifier, value);
        }
    }

    make_notifier (name) {
        var self = this;
        return function (event) {
            event.type = name + ':' + event.type;
            self.emit(event.type, event);
        };
    }
}
module.exports = Model;
