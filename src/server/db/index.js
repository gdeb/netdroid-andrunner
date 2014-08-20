/*jslint node: true */
'use strict';

// Module db

module.exports = function db (logger, options) {
	let adapter_file = `./${options.adapter}.js`;
	
	return {
		services: [require(adapter_file)] 
	};
};

