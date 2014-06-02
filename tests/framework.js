/*jslint node: true */
'use strict';

var traceur = require('traceur');
traceur.require.makeDefault();
traceur.options.blockBinding = true;


var framework = require('../src/client/js/framework.js'),
    Model = framework.Model;


var assert = require("assert");

describe('Model', function(){
    describe('#add_property', function(){
        it('should set a property', function(){
            var model = new Model();
            model.add_property('name');
            assert.strictEqual(true, model.hasOwnProperty('name'));
            assert.strictEqual(undefined, model.name.get());
        });
        it('should behave like a property', function () {
            var model = new Model();
            model.add_property('name', 'george');
            assert.strictEqual(model.name.get(), 'george');
            model.name.set('charles');
            assert.strictEqual(model.name.get(), 'charles');
        });
        it('should emit events', function (done) {
            var model = new Model();
            model.add_property('name');
            model.addListener('change:name', function (event) {
                assert.deepEqual(event, {
                    type: 'change:name',
                    old_value: undefined,
                    new_value: 'blip'
                });
                done();
            });
            model.name.set('blip');

        });
    });
});
