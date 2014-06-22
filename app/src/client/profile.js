/*jslint node: true */
/*global window:false, document: false */
'use strict';

window.addEventListener('DOMContentLoaded', function () {
	let passwords = document.getElementsByClassName("password");
	for (let i = 0; i < passwords.length; i++) {
		passwords[i].setAttribute('type', 'password');
	}
});

