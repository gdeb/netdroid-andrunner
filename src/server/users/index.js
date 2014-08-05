/*jslint node: true */
'use strict';

// Module users

let extend = require('node.extend');

module.exports = {
	init (logger, db, config) {
		logger.debug('initializing users');
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


