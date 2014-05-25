'use strict';

let anr = {
    framework: {},
    models: {},
    views: {},
    controllers: {},
};

//-----------------------------------------------------------------------------
anr.framework.EventEmitter = class {
    constructor () {
        this._callbacks = {};
    }
    addListener (event_name, callback) {
        this._callbacks[event_name] = this._callbacks[event_name] || [];
        this._callbacks[event_name].push(callback);
        return this;
    }
    emit (event_name, ...data) {
        let callbacks = this._callbacks[event_name];
        if (!callbacks) return this;
        for (let callback of callbacks) {
            callback(...data);
        }
        return this;
    }    
};

//-----------------------------------------------------------------------------
anr.framework.Model = class extends anr.framework.EventEmitter{
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
                let index = self._list_properties[name].push(data);
                self.emit(`add:${name}`, {
                    type: `add:${name}`, 
                    new_value: data,
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
            }
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
            push (data) {
                let index = list_dict[name].push(data);
                self.emit(`add:${name}`, {
                    type: `add:${name}`, 
                    new_value: data,
                    index: index,
                });
            },
            get (index) {
                return (index === undefined) 
                    ? list_dict[name].map(x => Object.assign({}, x))
                    : Object.assign({}, list_dict[name]);
            },
            set (index, attr, value) {
                if (index >= list_dict[name].length) {
                    throw new Error('Index out of list bound. Use push instead');                    
                }
                let obj = list_dict[name][index];
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
            }
        };
    }
};

//-----------------------------------------------------------------------------
anr.framework.View = class {
    constructor (controller) {
        this.controller = controller;
    }
};

//-----------------------------------------------------------------------------
anr.framework.Controller = class {
    constructor (client) {
        this.client = client;
    }
    read (msg) { // from web_socket
        console.log('controller', msg);
    }
    send (msg) {
        this.client.web_socket.send(JSON.stringify(msg));
    }    
};

