/*jslint node: true */
'use strict';

let Datastore = require('nedb'),
	fs = require('fs');

module.exports = function (folder, logger) {
	let db = {},
		collections = {};

	db.load = function (name) {
		let filename = `${folder}/${name}.db`,
			created = !fs.existsSync(filename);
		collections[name] = new Datastore({
			filename: filename,
			autoload: true
		});
		return created;
	};

	db.insert = function (name, document) {
		if (name in collections) {
			collections[name].insert(document);
		} else {
			throw new Error(`Collection ${name} does not exist.`);			
		}
	};

	db.find = function (name, info, callback) {
		if (name in collections) {
			collections[name].find(info, callback);
		} else {
			throw new Error(`Collection ${name} does not exist.`);			
		}
	};

	db.update = function (name, update, callback) {
		if (name in collections) {
			collections[name].update(update, callback);
		} else {
			throw new Error(`Collection ${name} does not exist.`);			
		}
	};

	return db;
};

