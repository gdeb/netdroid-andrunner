//-----------------------------------------------------------------------------
/*jslint node: true */
'use strict';

var expect = require('expect.js'),
	middlewares = require('../es5-src/server/middlewares.js');

//-----------------------------------------------------------------------------
let route_match = middlewares.route_match;

describe('Middlewares', function () {
	describe('#route_match', function () {
	    it('should match simple routes', function () {
	    	expect(route_match('/login', '/login')).to.be(true);
	    	expect(route_match('/', '/')).to.be(true);
	    });
	    it('should not match different simple routes', function () {
	    	expect(route_match('/login', '/')).to.be(false);
	    	expect(route_match('/login', '/login/')).to.be(false);
	    });
	    it('should match parameterized routes', function () {
	    	let route_1 = '/user/simon',
	    		route_2 = '/user/:user',
	    		route_3 = '/user/05/profile',
	    		route_4 = '/user/:id/profile';
	    	expect(route_match(route_1, route_2)).to.be(true);
	    	expect(route_match(route_3, route_4)).to.be(true);
	    });
	});
}); 
