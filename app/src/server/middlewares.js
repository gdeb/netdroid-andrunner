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

function restrict(routes, on_access_denied) {
	let unrestricted = routes.filter(r => r.unrestricted);
	return function (req, res, next) {
		if (req.session.user) 
			return next();
		for (let route of unrestricted) {
			if (route.path === req.url && 
				route.method === req.method.toLowerCase())
				return next();
		}
		on_access_denied(req, res);
	};
}


function http_logger(logger) {
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
	restrict: restrict,
	http_logger: http_logger,
};