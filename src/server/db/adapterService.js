/*jslint node: true */
'use strict';

let injector = require('../../injector');

injector.module('db').service('db_adapter', {
	config (db_type, db_folder) {
		this.type = db_type;
		this.folder = db_folder;
	},
	build (logger) {
		return require('./nedb.js')(logger, this.folder);
	}
});

