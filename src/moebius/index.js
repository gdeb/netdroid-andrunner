/*jslint node: true */
'use strict';

let Injector = require('./injector');

let injector = null;

function application (logger_options) {
	if (!injector) {
		// injector = new Injector (logger_options);
		injector = Injector;
		injector.config(logger_options	)
		application.module = injector.module.bind(injector);
		application.start = injector.start;
		application.constant = injector.constant;
	}
	return application;
};

module.exports = application;


