//-----------------------------------------------------------------------------
/*jslint node: true */
'use strict';

var expect = require('expect.js');

var traceur = require('traceur');
traceur.require.makeDefault();
traceur.options.blockBinding = true;

var Model = require('../src/common/model.js');

//-----------------------------------------------------------------------------
describe('Model', function () {
    it('should refuse to add twice same property', function () {
        var model = new Model();
        model.add_property('name', 'value');
        expect(function () {
            model.add_property('name', 'list');
        }).to.throwError();
    });

    describe('ValueProperty', function () {
        it('should emit change event', function (done) {
            var model = new Model();
            model.add_property('name', 'value', 'stephane');
            model.on('name:change', function (event) {
                expect(event).to.eql({
                    type: 'name:change',
                    new_value: 'xavier',
                    old_value: 'stephane'
                });
                done();
            });
            model.name.set('xavier');
        });
    });

    describe('ListProperty', function () {
        it('should emit change event', function (done) {
            var model = new Model();
            model.add_property('names', 'list', ['stephane','xavier']);
            model.on('names:change', function (event) {
                expect(event).to.eql({
                    type: 'names:change',
                    new_value: 'raphael',
                    old_value: 'xavier',
                    index: 1,
                });
                done();
            });
            model.names.set(1, 'raphael');
        });

        it('should not emit change event', function () {
            var model = new Model();
            model.add_property('names', 'list', ['stephane','xavier']);
            model.on('names:change', function (event) {
                throw new Error();
            });
            model.names.set(1, 'xavier');
        });


        it('should emit add events', function (done) {
            var model = new Model();
            model.add_property('names', 'list', ['stephane','xavier']);
            model.on('names:add', function (event) {
                expect(event).to.eql({
                    type: 'names:add',
                    new_value: 'raphael',
                    index: 2,
                });
                done();
            });
            model.names.add('raphael');
        });

        it('should emit remove events', function (done) {
            var model = new Model();
            model.add_property('names', 'list', ['stephane','xavier']);
            model.on('names:remove', function (event) {
                expect(event).to.eql({
                    type: 'names:remove',
                    removed_value: 'stephane',
                });
                done();
            });
            model.names.remove(0);
        });

        it('should emit also remove events', function (done) {
            var model = new Model();
            model.add_property('names', 'list', ['stephane','xavier']);
            model.on('names:remove', function (event) {
                expect(event).to.eql({
                    type: 'names:remove',
                    removed_value: 'xavier',
                });
                done();
            });
            model.names.remove(function (n) {
                return n === 'xavier';
            });
        });

        it('should emit reset events', function (done) {
            var model = new Model();
            model.add_property('names', 'list', ['stephane','xavier']);
            model.on('names:reset', function (event) {
                expect(event).to.eql({
                    type: 'names:reset',
                    new_value: [1,5,3],
                    old_value: ['stephane','xavier'],
                });
                done();
            });
            model.names.reset(1,5,3);
        });

    });

    describe('ListDictProperty', function () {
        it('should emit add events', function (done) {
            var model = new Model();
            model.add_property('players', 'list:dict', []);
            model.on('players:add', function (event) {
                expect(event).to.eql({
                    type: 'players:add',
                    new_value: {name: 'raphael'},
                    index: 0,
                });
                done();
            });
            model.players.add({name: 'raphael'});
        });

        it('should not leak references to objects', function (done) {
            var model = new Model();
            model.add_property('players', 'list:dict', []);
            model.on('players:add', function (event) {
                event.new_value.name = 'simon';
                expect(model.players.get(0)).to.eql({name:'raphael'});
                done();
            });
            model.players.add({name: 'raphael'});
        });

        it('should emit change event', function (done) {
            var model = new Model();
            model.add_property('players', 'list:dict', [{name:'stephane'}]);
            model.on('players:change', function (event) {
                expect(event).to.eql({
                    type: 'players:change',
                    new_value: {name:'xavier'},
                    old_value: {name:'stephane'},
                    index: 0
                });
                done();
            });
            model.players.set(0, {name: 'xavier'});
        });

        it('should not emit change event', function () {
            var model = new Model();
            model.add_property('players', 'list:dict', [{name:'stephane'}]);
            model.on('players:change', function (event) {
                throw new Error();
            });
            model.players.set(0, {name: 'stephane'});
        });

        it('should emit change attr event', function (done) {
            var model = new Model();
            model.add_property('players', 'list:dict', [{name:'stephane'}]);
            model.on('players:change:name', function (event) {
                expect(event).to.eql({
                    type: 'players:change:name',
                    new_value: 'xavier',
                    old_value: 'stephane',
                    index: 0
                });
                done();
            });
            model.players.set(0, 'name', 'xavier');
        });

        it('should not emit change attr event', function () {
            var model = new Model();
            model.add_property('players', 'list:dict', [{name:'stephane'}]);
            model.on('players:change:name', function (event) {
                throw new Error();
            });
            model.players.set(0, 'name', 'stephane');
        });

        it('should emit remove events', function (done) {
            var model = new Model();
            model.add_property('players', 'list:dict', [{name:'xavier'}]);
            model.on('players:remove', function (event) {
                expect(event).to.eql({
                    type: 'players:remove',
                    removed_value: {name:'xavier'},
                });
                done();
            });
            model.players.remove(0);
        });

    });
});




