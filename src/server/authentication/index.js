/*jslint node: true */
'use strict';

let extend = require('node.extend');

module.exports = function (logger) {
	return {
		modules: ['access_control', 'authentication'],
	};
};



// 	let authentication = {
// 		name: 'authentication',
// 		dependencies: ['users', 'http_server'],
// 		init (...deps) {
// 			extend(this, require('./authentication.js')(logger, ...deps));
// 		}
// 	};
// 	return [access_control, authentication];
// };

