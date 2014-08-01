/*jslint node: true */
'use strict';

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
};