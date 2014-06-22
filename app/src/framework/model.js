/*jslint node: true */
'use strict';

let EventEmitter = require('events').EventEmitter,
    prop = require('./properties.js');

let ValueProp = prop.ValueProperty;

//-----------------------------------------------------------------------------
class Model extends EventEmitter {
    constructor () {
        super();
        this._properties = {};
    }

    add_value_property (name, value) {
        if (name in this._properties) {
            throw new Error('Property already defined.');
        }
        this._properties[name] = new prop.ValueProperty(name, this, value);
    }


    // add_property(name, type, value) {
    //     if (name in this._properties) {
    //         throw new Error('Property already defined.');
    //     }
    //     switch (type) {
    //         case 'value':
    //             this._properties[name] = new ValueProp(name, this, value);
    //             break;
    //         default:
    //             throw new Error('Unkn')
    //     }
    //     let notifier = this.make_notifier(name);
    //     if (type === 'value') {
    //         this[name] = new prop.ValueProperty(notifier, value);
    //     } else if (type === 'list') {
    //         this[name] = new prop.ListProperty(notifier, value);
    //     } else if (type === 'list:dict') {
    //         this[name] = new prop.ListDictProperty(notifier, value);
    //     }
    // }

    // make_notifier (name) {
    //     var self = this;
    //     return function (event) {
    //         event.type = name + ':' + event.type;
    //         self.emit(event.type, event);
    //     };
    // }
}
module.exports = Model;
