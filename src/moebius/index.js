/*jslint node: true */
'use strict';

let Injector = require('./injector');

let injector = null;

function app (logger_options) {
	if (!injector) {
		injector = new Injector (logger_options);
		// injector = Injector;
		// injector.config(logger_options	)
		app.create_module = injector.create_module.bind(injector);
		app.module = injector.module.bind(injector);
		app.start = injector.start.bind(injector);
		app.create_constant = injector.create_constant.bind(injector);
	}
	return app;
};

module.exports = app;


