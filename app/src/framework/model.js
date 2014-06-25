/*jslint node: true */
'use strict';

let EventEmitter = require('events').EventEmitter,
    prop = require('./properties.js');


//-----------------------------------------------------------------------------
class Model extends EventEmitter {

    add_value_property (name, value) {
        if (name in this) 
            throw new Error('Property already defined.');
        this[name] = new prop.ValueProperty(name, this, value);

    }

    add_list_property (name, value) {
        if (name in this) 
            throw new Error('Property already defined.');
        this[name] = new prop.ListProperty(name, this, value);
    }

    add_list_dict_property (name, value) {
        if (name in this) 
            throw new Error('Property already defined.');
        this[name] = new prop.ListDictProperty(name, this, value);
    }

}
module.exports = Model;
