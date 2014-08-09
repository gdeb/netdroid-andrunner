/*jslint node: true */
'use strict';

// Module db

module.exports = function (logger, options) {
	let adapter = require(`./${options.adapter}.js`),
		folder = options.folder;

	return {
		link () {
			return adapter(logger, folder);
		},
	};
};

