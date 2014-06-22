/*jslint node: true */
'use strict';

// let EventEmitter = require('./event_emitter.js'),
let is_object_equal = require('../utils').is_object_equal;

//-----------------------------------------------------------------------------
class Property {
    constructor (name, model) {
        this.name = name;
        this.model = model;
    }
    notify (event) {
        this.model.emit(this.name + ':' + event.type, event);
    }
}

//-----------------------------------------------------------------------------
class ValueProperty extends Property {
    constructor (name, model, value) {
        this.value = value;
        super(name, model);
    }

    get () { return this.value; }

    set (value) {
        if (value === this.value) return;
        let old_val = this.value;
        this.value = value;
        this.notify({
            type: 'change',
            new_value: value,
            old_value: old_val
        });
    }
}

//-----------------------------------------------------------------------------
class ListProperty extends Property {
    constructor (name, model, initial = []) {
        if (!(initial instanceof Array))
            throw new Error('initial value should be an array');
        super(name, model);
        this._list = initial.slice(0);
    }
    get (index) {
        if (index === undefined) 
            return this._list.slice(0);
        else
            return this._list[index];
    }

    get length() {
        return this._list.length;
    }

    find (predicate) {
        for (let elem of this._list) {
            if (predicate(elem)) return elem;
        }
        return undefined;
    }

    findAll (predicate) {
        return this._list.filter(predicate);
    }

    set (index, value) {
        if (index < 0 || index >= this._list.length)
            throw new Error('index out of bounds');
        let old_value = this._list[index];
        if (value === old_value) 
            return;
        this._list[index] = value;
        this.notify({
            type: 'change',
            new_value: value,
            old_value: old_value,
            index: index,
        });
    }

    add (...elements) {
        for (let elem of elements) {
            let index = this._list.push(elem) - 1;
            this.notify({
                type: 'add',
                new_value: elem,
                index: index,
            });
        }
    }

    remove (index) {
        if (typeof index === 'function') {
            let new_list = [],
                predicate = index;
            for (let elem of this._list) {
                if (!predicate(elem)) 
                    new_list.push(elem);
                else
                    this.notify({
                        type: 'remove',
                        removed_value: elem
                    });
            }
            this._list = new_list;
        } else {
            if (index < 0 || index >= this._list.length)
                throw new Error('index out of bounds');
            let removed = this._list.splice(index, 1)[0];
            this.notify({
                type: 'remove',
                removed_value: removed,
            });
        }
    }

    reset(...new_list) {
        if (!(new_list instanceof Array))
            throw new Error('initial value should be an array');
        let old_list = this._list;
        this._list = new_list.slice(0);
        this.notify({
            type: 'reset',
            new_value: new_list,
            old_value: old_list,
        });
    }
}

//-----------------------------------------------------------------------------
class ListDictProperty extends ListProperty {
    constructor (name, model, initial) {
        super(name, model, initial);
        for (let i = 0; i < this._list.length; i++) {
            this._list[i] = Object.assign({}, this._list[i]);
        }
        // let old_notify = this.notify;
        // this.notify = (event) => old_notify(this.sanitize_event(event));
    }

    // sanitize_event (event) {
    //     if ('new_value' in event && typeof event.new_value !== 'string') 
    //         event.new_value = Object.assign({}, event.new_value);
    //         return event;        
    // }

    // add(...elements) {
    //     super(...elements.map(elem => Object.assign({}, elem)));
    // }

    // get(index, attr) {
    //     if (typeof index === 'number' && typeof attr === 'string') {
    //         if (index < 0 || index >= this._list.length)
    //             throw new Error('Index out of bounds');
    //         return this._list[index][attr];
    //     } else 
    //         return super(index);
    // }

    // set(index, obj, value) {
    //     if (typeof obj === 'string') {
    //         // obj = key, value = value
    //         let old_value = this._list[index][obj];
    //         if (old_value === value)
    //             return;
    //         this._list[index][obj] = value;
    //         this.notify({
    //             type: 'change:' + obj,
    //             new_value: value,
    //             old_value: old_value,
    //             index: index,
    //         });
    //     } else {
    //         // obj = obj to set, value = undefined
    //         if (is_object_equal(obj, this._list[index]))
    //             return;
    //         super(index, Object.assign({}, obj));
    //     }
    // }

    // reset(...elements) {
    //     super(...elements.map(elem => Object.assign({}, elem)));
    // }

    // remove(object) {
    //     if (typeof object !== 'object')
    //         return super(object);
    //     let keys = Object.keys(object);

    //     let to_remove = function (elem) {
    //         for (let key of keys) {
    //             if (elem[key] !== object[key]) return false;
    //         }
    //         return true;
    //     };
    //     return super(to_remove);
    // }
}

//-----------------------------------------------------------------------------
module.exports = {
    ValueProperty: ValueProperty,
    ListProperty: ListProperty,
    ListDictProperty: ListDictProperty,
};



