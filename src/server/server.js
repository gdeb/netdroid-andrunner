/*jslint node: true */
'use strict';

//-----------------------------------------------------------------------------

let x = 'lol'; 
let f = x => x + 3;

class Test {
	constructor (opt = 1) {
		console.log(opt);
		this.nrst();
	}
	nrst () {
		console.log([1,2,3].map(x => 2*x));
	}
}

function Server(port) {
	this.port = port || 8080;
	new Test('nrtsnnnn');
}

new Server(40);

module.exports = Server;