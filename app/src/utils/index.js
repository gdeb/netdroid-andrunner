/*jslint node: true */
'use strict';

//-----------------------------------------------------------------------------

// return true if two objects have the same keys and the same
// values (values are compared with ===)
module.exports.is_object_equal = function (obj1, obj2) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) 
        return false;
    for (let key of Object.keys(obj1)) 
        if (obj1[key] !== obj2[key]) return false;
    return true;
};

// convert x to a string a add as many characters char 
// as needed to make sure the result length is equal to n
module.exports.pad_left = function (x, char, n) {
	let result = String(x);
	while (result.length < n) {
		result = char + result;
	}
	return result;
};

module.exports.extend = function (obj, prop) {
	for (let p in prop) {
		obj[p] = prop[p];
	}
	return obj;
}