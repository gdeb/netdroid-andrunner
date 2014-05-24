/*jslint node: true */
'use strict';

var traceur = require('traceur');
traceur.require.makeDefault();
traceur.options.blockBinding = true;

//-----------------------------------------------------------------------------
// Launch server
//-----------------------------------------------------------------------------
var Server = require('./server.js'),
    server = new Server();

server.start();
