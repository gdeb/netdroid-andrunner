var traceur = require('traceur');

traceur.require.makeDefault();
traceur.options.blockBinding = true;

var Server = require('./server.js');

new Server();
