/*jslint node: true */
'use strict';

//-----------------------------------------------------------------------------
// Custom Middlewares
//-----------------------------------------------------------------------------
function ignore_url (...urls) {
	return function (req, res, next) {
		if (urls.indexOf(req.url) > - 1)
			res.send(404);
		else
			next();
	};
}

function restrictAccess(req, res, next) {
	if (req.url === '/' || req.url === '/login' || req.session.user) 
		return next();
	req.session.error = "Access denied";
	res.redirect('login');
}

function adapt_logger(logger) {
	return function (req, res, next) {
		const start = process.hrtime();

	   	function logRequest(){
	      	res.removeListener('finish', logRequest);
	      	let diff = process.hrtime(start),
	      		request_time = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3),
	      		http = req.httpVersionMajor + '.' + req.httpVersionMinor,
	      		url = req.originalUrl || req.url,
	      		code = res.statusCode,
	      		status = (code === 404) ? String(code).red : code;

	      	logger.info([
	      		req.ip,
	      		`${req.method} ${req.url} (HTTP/${http})`,
	      		`status: ${status}`,
	      		`${request_time} ms`,
	      	].join(', '));
	    }
	    res.on('finish', logRequest);
		next();
	};
}

module.exports = {
	ignore_url: ignore_url,
	restrictAccess: restrictAccess,
	adapt_logger: adapt_logger,
};