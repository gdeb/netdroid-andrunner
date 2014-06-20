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

function annotate_route(routes, no_match) {
	return function (req, res, next) {
		for (let route of routes) {
			if (route.path === req.url && 
				route.method === req.method.toLowerCase()) {
				req.matched_route = route;
				return next();
			}
		}
		req.session.error = "Invalid URL";
		no_match(req, res);
	}
}

function restrict(on_access_denied) {
	return function (req, res, next) {
		if (req.session.user || req.matched_route.unrestricted) 
			return next();
		req.session.error = "Access Denied";
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
	annotate_route: annotate_route,
	restrict: restrict,
	http_logger: http_logger,
};