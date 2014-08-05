/*jslint node: true */
'use strict';

// Module users

let extend = require('node.extend');

module.exports = function (logger) {

	return {
		dependencies: ['db', 'config'],
		init (db, config) {
		    extend(this, require('./model.js')(logger, db));

			let created = db.load('users');
			if (created) {
				let roles = config.get('user_roles');
				for (let user of require('./data.json')) {
					user.role = roles[user.role];
					this.add(user);
				}				
			}
		    logger.info('initialization complete');
		}
	};
};


