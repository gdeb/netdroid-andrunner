/*jslint node: true */
'use strict';

function lobby (req, res, options) {
	res.render('lobby', options);
}

module.exports.lobby = {
	urls: ['/lobby'],
	methods: ['get'],
	controller: lobby,
};

//-----------------------------------------------------------------------------
function profile (req, res, options) {
	res.render('profile', options);
}

module.exports.profile = {
	urls: ['/profile'],
	methods: ['get'],
	controller: profile,
};

//-----------------------------------------------------------------------------
function chat (msg, session) {
	console.log('MSG', msg);
	session.websocket.send('yopla');
}

module.exports.chat = {
	websocket: true,
	dispatch: msg => msg.type === 'register_chat',
	controller: chat,
};