/*jslint node: true */
'use strict';


module.exports = function model (logger, options) {

	return {
		depends: ['db.adapter', 'users.permission'],
		activate (...deps) {
			return require('./model.js')(logger, ...deps);
		}
	};
};
