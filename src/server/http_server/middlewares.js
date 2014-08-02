/*jslint node: true */
'use strict';

module.exports.ignore_url = function (...urls) {
	return (req,res,next) => urls.indexOf(req.url)>-1 ? res.send(404) : next();
};

module.exports.http_logger = function (logger) {
	return function (req, res, next) {
		const start = process.hrtime();

	   	function logRequest(){
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
	    res.once('finish', logRequest);
		next();
	};
};

