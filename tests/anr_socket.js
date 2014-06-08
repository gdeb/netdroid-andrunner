/*jslint node: true */
'use strict';

var expect = require('expect.js');

var traceur = require('traceur');
traceur.require.makeDefault();
traceur.options.blockBinding = true;

var ANRSocket = require('../src/server/anr_socket.js');

var EventEmitter = require('events').EventEmitter;

//-----------------------------------------------------------------------------
var mock_logger = {info: function () {}};

var mock_socket = new EventEmitter();
mock_socket.send = function (msg) {
    var result = JSON.parse(msg);
    expect(result.type).to.be('type');
    expect(result.content).to.be('content');
};

//-----------------------------------------------------------------------------
describe('ANRSocket', function () {
    it('should write messages', function () {
        var anr_socket = new ANRSocket(mock_socket, mock_logger);
        anr_socket.write({type:'type', content:'content'});
    });

    it('should send messages', function () {
        var anr_socket = new ANRSocket(mock_socket, mock_logger);
        anr_socket.send("type", "content");
    });
});