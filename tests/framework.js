/*jslint node: true */
'use strict';

var traceur = require('traceur');
traceur.require.makeDefault();
traceur.options.blockBinding = true;


var assert = require('assert'),
    framework = require('../src/client/js/framework.js'),
    EventEmitter = framework.EventEmitter,
    Model = framework.Model;

//-----------------------------------------------------------------------------
describe('EventEmitter', function () {
    it('should accept listener and emit events', function (done) {
        var emitter = new EventEmitter();
        emitter.addListener('test_event', function (data) {
            assert.strictEqual(data, 'data');
            done();
        });
        emitter.emit('test_event', 'data');
    });
});

//-----------------------------------------------------------------------------
describe('Model', function () {
    describe('#add_property', function () {
        it('should set a property', function () {
            var model = new Model();
            model.add_property('name');
            assert.strictEqual(true, model.hasOwnProperty('name'));
            assert.strictEqual(undefined, model.name.get());
        });

        it('should refuse to set twice same property', function () {
            var model = new Model();
            model.add_property('name');
            assert.throws(function () {
                model.add_property('name');
            });
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

    describe('#add_list_property', function () {
        it('should set a property', function () {
            var model = new Model();
            model.add_list_property('name');
            assert.strictEqual(true, model.hasOwnProperty('name'));
            assert.deepEqual([], model.name.get());
        });

        it('should refuse to set twice same property', function () {
            var model = new Model();
            model.add_property('name');
            assert.throws(function () {
                model.add_list_property('name');
            });
        });


    });
});

