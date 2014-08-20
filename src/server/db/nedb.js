/*jslint node: true */
'use strict';

let Datastore = require('nedb'),
	fs = require('fs');

let str = JSON.stringify;

module.exports = function adapter (logger, options) {
	let collections = {},
		folder = options.folder;

	function in_collection(name, method, ...args) {
		if (name in collections) {
			collections[name][method](...args);
		} else {
			logger.error(`No collection (${name},${method},${args})`);
			return;
		}		
	}

	function load (name) {
		logger.debug(`loading/creating collection ${name}`);
		let filename = `${folder}/${name}.db`,
			created = !fs.existsSync(filename);
		collections[name] = new Datastore({
			filename: filename,
			autoload: true
		});
		return created;			
	}

	function insert (name, doc) {
		logger.debug(`inserting ${str(doc)} in ${name}`);
		in_collection(name, 'insert', doc);
	}

	function find (name, info, callback) {
		in_collection(name, 'find', info, callback);
	}

	function update (name, info, callback) {
		logger.debug(`updating ${name} with ${str(info)}`);
		in_collection(name, 'update', info, callback);
	}

	return {
		activate () {
			return {
				load: load,
				insert: insert,
				find: find,
				update: update,
			};
		}
	};
};

