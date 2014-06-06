/*jslint node: true */
'use strict';

var expect = require('expect.js');
var traceur = require('traceur');
traceur.require.makeDefault();
traceur.options.blockBinding = true;

var EventEmitter = require('../../src/common/event_emitter.js');

//-----------------------------------------------------------------------------
describe('EventEmitter', function () {
    it('should accept listener and emit events', function (done) {
        var emitter = new EventEmitter();
        emitter.on('test_event', function (data) {
            expect(data).to.be('data');
            done();
        });
        emitter.emit('test_event', 'data');
    });

    it('should emit events just once if asked', function (done) {
        var emitter = new EventEmitter(),
            n = 0;
        emitter.once('test_event', function (data) {
            n++;
            if (n === 1) { done();}
            else throw new Error();
        });
        emitter.emit('test_event', 'data');
        emitter.emit('test_event', 'data');
    });
});
