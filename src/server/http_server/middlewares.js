/*jslint node: true */
'use strict';

module.exports.ignore_url = function (...urls) {
	return function (req,res,next) {
		return urls.indexOf(req.url)>-1 ? res.status(404).end() : next();
	};
};

module.exports.http_logger = function (logger) {
	return function (req, res, next) {
		const start = process.hrtime();

	    res.once('finish', function () {
	    	logger.info(format_log(req, res, start));
	    });
		next();
	};
};

function format_log(req, res, start){
  	let diff = process.hrtime(start),
  		request_time = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3),
  		http = req.httpVersionMajor + '.' + req.httpVersionMinor,
  		url = req.originalUrl || req.url,
  		code = res.statusCode,
  		status = (code === 404) ? String(code).red : code;

  	return `${req.ip}, ${req.method} ${req.url} (HTTP/${http})` +
  		   `status: ${status}, ${request_time} ms`;
}
