/*jslint node: true */
'use strict';

let Datastore = require('nedb'),
	fs = require('fs');

module.exports = function (folder, logger) {
	let db = {},
		collections = {};

	function in_collection(name, method, ...args) {
		if (name in collections) {
			collections[name][method](...args);
		} else {
			throw new Error(`Collection ${name} does not exist.`);			
		}		
	}

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
		in_collection(name, 'insert', document);
	};

	db.find = function (name, info, callback) {
		in_collection(name, 'find', info, callback);
	};

	db.update = function (name, info, callback) {
		in_collection(name, 'update', info, callback);
	};

	return db;
};

