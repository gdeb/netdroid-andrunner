/*jslint node: true */
'use strict';

// Module db

module.exports = function (logger, options) {
	let adapter = require(`./${options.adapter}.js`);

	return {
		dependencies: ['config'],
		load (...deps) {
			return adapter(logger, ...deps);
		}
	};
};

