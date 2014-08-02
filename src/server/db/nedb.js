/*jslint node: true */
'use strict';

let Datastore = require('nedb'),
	fs = require('fs');

module.exports = function (folder, logger) {
	let collections = {};

	function in_collection(name, method, ...args) {
		if (name in collections) {
			logger.info(`${name}.${method}: ${args}`)
			collections[name][method](...args);
		} else {
			logger.error(`No collection (${name},${method},${args})`);
			throw new Error(`Collection ${name} does not exist.`);			
		}		
	}

	return {
		load (name) {
			let filename = `${folder}/${name}.db`,
				created = !fs.existsSync(filename);
			collections[name] = new Datastore({
				filename: filename,
				autoload: true
			});
			return created;			
		},
		insert (name, doc) {
			in_collection(name, 'insert', doc);
		},
		find (name, info, callback) {
			in_collection(name, 'find', info, callback);
		},
		update (name, info, callback) {
			in_collection(name, 'update', info, callback);
		},
	};
};

