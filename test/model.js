/*jslint node: true */
'use strict';

let expect = require('expect.js'),
    Model = require('../es5-src/framework/model.js');

//-----------------------------------------------------------------------------
describe('Model', function () {
    it('should refuse to add twice same property', function () {
        var model = new Model();
        model.add_value_property('name', 'value');
        expect(() => model.add_value_property('name', 'list')).to.throwError();
    });

    it('should set a value property', function () {
    	var model = new Model();
        model.add_value_property('name', 'value');
		expect(model.name.get()).to.be('value');    	
    });

    it('should set a list property', function () {
    	var model = new Model();
        model.add_list_property('name', ['value']);
		expect(model.name.get()).to.eql(['value']);    	
    });

    it('should set a list dict property', function () {
    	var model = new Model();
        model.add_list_dict_property('name', [{name:'stephane'}]);
		expect(model.name.get()).to.eql([{name:'stephane'}]);    	
    });
});
