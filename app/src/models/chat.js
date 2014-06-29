/*jslint node: true */
'use strict';

let Model = require('../framework/model.js');

let chat = new Model();

chat.add_list_property('messages');
chat.add_list_property('players');

module.exports.chat = chat;