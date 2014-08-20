/*jslint node: true */
'use strict';

module.exports = function db (logger, options) {	
	return {
		values: [require(`./${options.adapter}.js`)]
	};
};

