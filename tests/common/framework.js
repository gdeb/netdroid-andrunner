/*jslint node: true */
'use strict';

var expect = require('expect.js');

var traceur = require('traceur');
traceur.require.makeDefault();
traceur.options.blockBinding = true;

var framework = require('../../src/common/framework.js'),
    Model = framework.Model;

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

        it('should not emit event when setting obj', function () {
            var model = new Model();
            model.add_list_dict_property('name');
            model.name.push({raphael:'stephane'});
            model.addListener('change:name', function () {
                throw new Error();
            });
            model.name.set(0, {raphael:'stephane'});
        });

        it('should not emit event when setting value', function () {
            var model = new Model();
            model.add_list_dict_property('name');
            model.name.push({raphael:'stephane'});
            model.addListener('change:name:raphael', function () {
                throw new Error();
            });
            model.name.set(0, 'raphael', 'stephane');
        });

        it('should emit add:name event', function (done) {
            var model = new Model();
            model.add_list_dict_property('name');
            model.addListener('add:name', function (event) {
                expect(event).to.eql({
                    type: 'add:name',
                    new_value: {test:'xavier'},
                    index: 0,
                });
                done();
            });
            model.name.push({test:'xavier'});
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

        it('should emit add:name:attr event', function (done) {
            var model = new Model();
            model.add_list_dict_property('name');
            model.name.push({test:'xavier'});
            model.addListener('add:name:simon', function (event) {
                expect(event).to.eql({
                    type: 'add:name:simon',
                    new_value: 'test',
                    attribute: 'simon',
                    index: 0,
                });
                done();
            });
            model.name.set(0,'simon', 'test');
        });

        it('should reset properly', function () {
            var model = new Model();
            model.add_list_dict_property('name');
            model.name.push({test:'xavier'});
            model.name.reset([{xavier:'test'}]);
            expect(model.name.get()).to.eql([{xavier:'test'}]);
        });

        it('should emit reset event', function (done) {
            var model = new Model();
            model.add_list_dict_property('name');
            model.addListener('reset:name', function (event) {
                expect(event).to.eql({
                    type:'reset:name',
                    new_value: [{xavier: 'test'}],
                    old_value: [{test:'xavier'}],
                });
                done();
            });
            model.name.push({test:'xavier'});
            model.name.reset([{xavier:'test'}]);
        });

        it('should remove elements', function () {
            var model = new Model();
            model.add_list_dict_property('name');
            model.name.reset([{a:1}, {a:2}, {a:3}]);
            model.name.remove(function (obj) { return obj.a === 2;});
            expect(model.name.get()).to.eql([{a:1},{a:3}]);
        });

        it('should emit remove elements', function (done) {
            var model = new Model();
            model.add_list_dict_property('name');
            model.name.push({a:1});
            model.addListener('remove:name', function (event) {
                expect(event).to.eql({
                    type: 'remove:name',
                    removed: {a:1},
                });
                done();
            });
            model.name.remove(function () {return true;});
        });
    });
    
});

