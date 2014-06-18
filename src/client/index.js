/*jslint node: true */
'use strict';

let test = require('./test.js');

window.addEventListener('DOMContentLoaded', function () {
	console.log(test.get_message());
});
