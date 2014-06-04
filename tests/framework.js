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

        it('should emit change events', function (done) {
            new Model()
                .add_property('name')
                .addListener('change:name', function (event) {
                    expect(event).to.eql({
                        type: 'change:name',
                        old_value: undefined,
                        new_value: 'blip'
                    });
                    done();
                })
                .name.set('blip');
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

        it('should refuse index out of bound', function () {
            var model = new Model();
            model.add_list_property('name');
            model.name.push('george');
            expect(function () {
                model.name.set(1,'stephane');
            }).to.throwError();
        });
    });

    describe('#add_list_dict_property', function () {
        it('should set a property', function () {
            var model = new Model();
            model.add_list_dict_property('name');
            expect(model).to.have.property('name');
            expect(model.name.get()).to.eql([]);
        });

        it('should refuse to set twice same property', function () {
            var model = new Model().add_list_dict_property('name');
            expect(function () {
                model.add_list_dict_property('name');
            }).to.throwError();
        });
        it('should correctly manipulate list', function () {
            var model = new Model();
            model.add_list_dict_property('name')
            expect(model.name.length()).to.be(0);
            expect(model.name.get()).to.eql([]);
            model.name.push({test:'george'});
            expect(model.name.get(0)).to.eql({test:'george'});
            expect(model.name.length()).to.be(1)
            expect(model.name.get()).to.eql([{test:'george'}]);

            model.name.push({brol:'albert'});
            expect(model.name.get()).to.eql([
                {test:'george'},{brol:'albert'}
            ]);

            model.name.set(0, {test:'philippe'});
            expect(model.name.get()).to.eql([
                {test:'philippe'},{brol:'albert'}
            ]);
            expect(model.name.get(1)).to.eql({brol:'albert'});
            expect(model.name.length()).to.be(2);
            expect(model.name.get(2)).to.be(undefined);
        });

        it('should emit add events', function (done) {
            var model = new Model();
            model.add_list_dict_property('name');
            model.addListener('add:name', function (event) {
                expect(event).to.eql({
                    type: 'add:name',
                    new_value: {test:'roger'},
                    index: 0
                });
                done();
            });
            model.name.push({test:'roger'});
        });

        it('should refuse index out of bound', function () {
            var model = new Model();
            model.add_list_dict_property('name');
            model.name.push({value:'george'});
            expect(function () {
                model.name.set(1,{test:'stephane'});
            }).to.throwError();
        });

        it.skip('should not emit event', function (done) {
            var model = new Model();
            model.add_list_dict_property('name');
            model.name.push({raphael:'stephane'});
            model.addListener('change:name', function () {
                throw new Error();
            });
            model.name.set(0, {raphael:'stephane'});
        });

        it('should emit change:name event', function (done) {
            var model = new Model();
            model.add_list_dict_property('name');
            model.name.push({test:'xavier'});
            model.addListener('change:name', function (event) {
                expect(event).to.eql({
                    type: 'change:name',
                    new_value: {value:'raphael'},
                    old_value: {test: 'xavier'},
                    index: 0,
                });
                done();
            });
            model.name.set(0, {value:'raphael'});
        });

        it('should emit change:name:test event', function (done) {
            var model = new Model();
            model.add_list_dict_property('name');
            model.name.push({test:'xavier'});
            model.addListener('change:name:test', function (event) {
                expect(event).to.eql({
                    type: 'change:name:test',
                    new_value: 'raphael',
                    old_value: 'xavier',
                    attribute: 'test',
                    index: 0,
                });
                done();
            });
            model.name.set(0, 'test', 'raphael');
        });

    });
    
});

