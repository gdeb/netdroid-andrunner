//-----------------------------------------------------------------------------
/*jslint node: true */
'use strict';

var expect = require('expect.js'),
	logger = require('../src/logger');

//-----------------------------------------------------------------------------
describe('Logger', function () {
    it('should have the correct interface', function () {
    	expect(logger).to.have.property('info');
    	expect(logger).to.have.property('error');
    	expect(logger).to.have.property('debug');
    	expect(logger).to.have.property('warn');
    });
}); 
