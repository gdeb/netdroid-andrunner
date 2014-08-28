/*jslint node: true */
'use strict';

let app = require('../../moebius');

app.module('db').service('DB', {
	config (db_type, db_folder) {
		this.type = db_type;
		this.folder = db_folder;
	},
	build (logger) {
		return require('./nedb.js')(logger, this.folder);
	}
});

