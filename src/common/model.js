/*jslint node: true */
'use strict';

let EventEmitter = require('./event_emitter.js');
// let EventEmitter = require('events').EventEmitter;


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

module.exports = class Model extends EventEmitter{
    constructor (...args) {
        super(...args);
        this._simple_properties = {};
        this._list_properties = {};
        this._list_dict_properties = {};
    }

    add_property (name, initial_value) {
        if (this[name]) {
            throw new Error(`Property ${name} already exists`);
        }
        let self = this;
        this._simple_properties[name] = initial_value;
        this[name] = {
            get () { return self._simple_properties[name]; },
            set (new_value) {
                if (new_value === self._simple_properties[name]) return;
                let old_value = self._simple_properties[name];
                self._simple_properties[name] = new_value;
                self.emit(`change:${name}`, {
                    type: `change:${name}`,
                    old_value: old_value,
                    new_value: new_value,
                });
            }
        };
        return this;
    }

    add_list_property (name) {
        if (this[name]) {
            throw new Error(`Property ${name} already exists`);
        }
        let self = this;
        this._list_properties[name] = [];
        this[name] = {
            length () { return self._list_properties[name].length; },
            get (index) { 
                return (index === undefined) 
                    ? self._list_properties[name].slice(0)
                    : self._list_properties[name][index]; 
            },
            push (data) {
                let index = self._list_properties[name].push(data) - 1;
                self.emit(`add:${name}`, {
                    type: `add:${name}`, 
                    new_value: data,
                    index: index,
                });
            },
            remove (index) {
                let list = self._list_properties[name];
                if (index >= list.length) {
                    throw new Error('Index out of list bound. Use push instead');
                }
                let removed = list.splice(index,1)[0];
                self.emit(`remove:${name}`, {
                    type: `remove:${name}`,
                    removed: removed,
                    index: index,
                });
            },

            set (i, data) {
                let list = self._list_properties[name];
                if (i >= list.length) {
                    throw new Error('Index out of list bound. Use push instead');
                }
                if (list[i] === data) return;
                let old_value = list[i];
                list[i] = data;
                self.emit(`change:${name}`, {
                    type: `change:${name}`,
                    new_value: data,
                    old_value: old_value,
                    index: i,
                });
            },
        };
    }

    add_list_dict_property (name) {
        if (this[name]) {
            throw new Error(`Property ${name} already exists`);
        }
        let self = this,
            list_dict = this._list_dict_properties;
        list_dict[name] = [];
        this[name] = {
            length () { return list_dict[name].length; },
            push (data, options = {}) {
                let index = list_dict[name].push(data) - 1;
                if (!options.silent) {
                    self.emit(`add:${name}`, {
                        type: `add:${name}`, 
                        new_value: data,
                        index: index,
                    });
                }
            },
            get (index) {
                if (index === undefined)
                    return list_dict[name].map(x => Object.assign({}, x));
                if (index >= list_dict[name].length) 
                    return undefined;
                return Object.assign({}, list_dict[name][index]);
            },
            set (index, attr, value) {
                if (index >= list_dict[name].length) {
                    throw new Error('Index out of list bound. Use push instead');                    
                }
                let obj = list_dict[name][index];
                if (typeof attr === 'object') {
                    if (is_equal(attr, obj)) return;
                    list_dict[name][index] = attr;
                    self.emit(`change:${name}`, {
                        type: `change:${name}`,
                        new_value: attr,
                        old_value: obj,
                        index: index,
                    });
                    return;
                }
                if (obj.hasOwnProperty(attr)) {
                    if (obj[attr] === value) return;
                    let old_value = obj[attr];
                    obj[attr] = value;
                    self.emit(`change:${name}:${attr}`, {
                        type: `change:${name}:${attr}`,
                        new_value: value,
                        old_value: old_value,
                        index: index,
                        attribute: attr,
                    });
                } else {
                    obj[attr] = value;
                    self.emit(`add:${name}:${attr}`, {
                        type: `add:${name}:${attr}`,
                        new_value: value,
                        index: index,
                        attribute: attr,
                    });
                }
            },
            reset (new_list_dict, options = {}) {
                let old_value = list_dict[name];
                list_dict[name] = [];
                for (let obj of new_list_dict) {
                    list_dict[name].push(obj);
                }
                if (!options.silent) {
                    self.emit(`reset:${name}`, {
                        type: `reset:${name}`,
                        new_value: list_dict[name].slice(0),
                        old_value: old_value,
                    });
                }
            },
            remove (filter) {
                let old_list = list_dict[name];
                list_dict[name] = [];
                for (let obj of old_list) {
                    if (filter(obj)) {
                        self.emit(`remove:${name}`, {
                            type: `remove:${name}`,
                            removed: obj,
                            index: old_list.indexOf(obj),
                        });
                    } else {
                        list_dict[name].push(obj);
                    }
                }
            }
        };
        return this;
    }
};

