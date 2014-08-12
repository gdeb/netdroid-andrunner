/*jslint node: true */
'use strict';

require('autostrip-json-comments');

let loader = require('./loader.js'),
	env = process.env.NODE_ENV,
	config_file = `./${env==='production' ? 'production' : 'development'}.json`,
	project_config = require(config_file),
	netdroid = loader(project_config);

if (require.main === module) { // standalone
	netdroid.load();
	netdroid.link();
	netdroid.run();
} else {
	module.exports = netdroid;
}



