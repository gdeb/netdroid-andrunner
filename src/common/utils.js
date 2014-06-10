/*jslint node: true */
'use strict';

//-----------------------------------------------------------------------------

let __id_counter = 0;

module.exports.uniqueId = function () {
    return __id_counter++;
};


//-----------------------------------------------------------------------------
// return true if two objects have the same keys and the same
// values (values are compared with ===)
module.exports.is_object_equal = function (obj1, obj2) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) 
        return false;
    for (let key of Object.keys(obj1)) 
        if (obj1[key] !== obj2[key]) return false;
    return true;
}

