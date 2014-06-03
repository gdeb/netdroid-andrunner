/*jslint node: true */
'use strict';

var expect = require('expect.js');

var traceur = require('traceur');
traceur.require.makeDefault();
traceur.options.blockBinding = true;

var framework = require('../src/client/js/framework.js'),
    EventEmitter = framework.EventEmitter,
    Model = framework.Model;

//-----------------------------------------------------------------------------
describe('EventEmitter', function () {
    it('should accept listener and emit events', function (done) {
        var emitter = new EventEmitter();
        emitter.addListener('test_event', function (data) {
            expect(data).to.be('data');
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

            expect(model).to.have.property('name');
            expect(model.name.get()).to.be(undefined);
        });

        it('should refuse to set twice same property', function () {
            var model = new Model();
            model.add_property('name');
            expect(function () { 
                model.add_property('name');
            }).to.throwError();
        });

        it('should behave like a property', function () {
            var model = new Model();
            model.add_property('name', 'george');
            expect(model.name.get()).to.be('george');
            model.name.set('charles');
            expect(model.name.get()).to.be('charles');
        });

        it('should emit events', function (done) {
            var model = new Model();
            model.add_property('name');
            model.addListener('change:name', function (event) {
                expect(event).to.eql({
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
            expect(model).to.have.property('name');
            expect(model.name.get()).to.eql([]);
        });

        it('should refuse to set twice same property', function () {
            var model = new Model();
            model.add_property('name');
            expect(function () {
                model.add_list_property('name');
            }).to.throwError();
        });

        it('should correctly manipulate list', function () {
            var model = new Model();
            model.add_list_property('name')
            expect(model.name.length()).to.be(0);
            expect(model.name.get()).to.eql([]);
            model.name.push('george');
            expect(model.name.get(0)).to.be('george');
            expect(model.name.length()).to.be(1)
            expect(model.name.get()).to.eql(['george']);

            model.name.push('albert');
            expect(model.name.get()).to.eql(['george','albert']);

            model.name.set(0, 'philippe');
            expect(model.name.get()).to.eql(['philippe','albert']);
            expect(model.name.get(1)).to.be('albert');
            expect(model.name.length()).to.be(2);
            expect(model.name.get(3)).to.be(undefined);
        });

        it('should emit add events', function (done) {
            var model = new Model();
            model.add_list_property('name');
            model.name.push('george');
            model.addListener('add:name', function (event) {
                expect(event).to.eql({
                    type: 'add:name',
                    new_value: 'roger',
                    index: 1
                });
                done();
            });
            model.name.push('roger');
        });

        it('should emit change events', function (done) {
            var model = new Model();
            model.add_list_property('name');
            model.name.push('george');
            model.name.push('roger');
            model.addListener('change:name', function (event) {
                expect(event).to.eql({
                    type: 'change:name',
                    new_value: 'simon',
                    old_value: 'roger',
                    index: 1
                });
                done();
            });
            model.name.set(1, 'simon')
        });

    });
});

