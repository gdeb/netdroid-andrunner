//-----------------------------------------------------------------------------
/*jslint node: true */
'use strict';

var expect = require('expect.js'),
	utils = require('../es5-src/utils');

//-----------------------------------------------------------------------------

describe('utils', function () {
	describe('#is_object_equal', function () {
		let is_object_equal = utils.is_object_equal;
	    it('should compare simple objects', function () {
	    	let a = {b:1, c:2, d:3},
	    		b = {b:1, c:2, d:3},
	    		c = {a:1, b:2, c:4};
	    	expect(is_object_equal(a,b)).to.be(true);
	    	expect(is_object_equal(b,c)).to.be(false);
	    });
	    it('should not consider equal more than one level', function () {
	    	let a = {a: {b: 'c'}},
	    		b = {a: {b: 'c'}};
	    	expect(is_object_equal(a,b)).to.be(false);
	    });
	});

	describe('#pad', function () {
		let pad_left = utils.pad_left;

		it('should pad strings', function () {
			expect(pad_left('test', ' ', 5)).to.be(' test');
			expect(pad_left('test', 'a', 8)).to.be('aaaatest');
		});
		it('should convert numbers to string', function () {
			expect(pad_left(12, 0, 5)).to.be('00012');
		});
		it('should not truncate the value', function () {
			expect(pad_left('test', ' ', 2)).to.be('test');
		});
	});
}); 
