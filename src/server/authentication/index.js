/*jslint node: true */
'use strict';

module.exports = function (logger) {
	return {
		depends: ['users', 'http_server'],
		link(...deps) {
			require('./routes.js')(logger, ...deps);
		}

	};
};

