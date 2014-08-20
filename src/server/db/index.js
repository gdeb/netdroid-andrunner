/*jslint node: true */
'use strict';

// Module db

let adapter;

module.exports = function (logger, options) {
	logger.debug(`loading ${options.adapter}`);
	let adapter_file = `./${options.adapter}.js`;
	
	return {
		depends: [],
		activate () {},
		services: {
			adapter: require(adapter_file)
		},
	};
};

