/*jslint node: true */
'use strict';

// convert x to a string a add as many characters char 
// as needed to make sure the result length is equal to n
function pad_left (x, char, n) {
	let result = String(x);
	while (result.length < n) {
		result = char + result;
	}
	return result;
};

function extend (obj, prop) {
	for (let p in prop) {
		obj[p] = prop[p];
	}
	return obj;
}

function pad (x) {
	return pad_left(x, 0, 2);
}

function getTimeStamp() {
    let now = new Date(),
        hours = pad(now.getHours()),
        minutes = pad(now.getMinutes()),
        seconds = pad(now.getSeconds());
    return `${hours}:${minutes}:${seconds}`;
}

module.exports = {
	pad_left: pad_left,
	pad: pad,
	extend: extend,
	getTimeStamp: getTimeStamp,
};