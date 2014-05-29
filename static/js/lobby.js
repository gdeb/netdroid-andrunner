'use strict';

//-----------------------------------------------------------------------------
anr.models.Lobby = class extends anr.framework.Model {
    constructor (...args) {
        super(...args);
        this.add_property('name', 'anonymous');
        this.add_list_property('notifications');
        this.add_list_dict_property('players');
    }
};

//-----------------------------------------------------------------------------
anr.views.Lobby = class extends anr.framework.View {
    constructor (controller, model) {
        super(controller);

        model.addListener('add:notifications', ev => this.update_textbox(ev));
        model.addListener('change:name', ev => this.update_prompt(ev));
        model.addListener('add:players', ev => this.update_players_list(ev));

        this.input = document.getElementById('command-prompt');
        this.textbox = document.getElementById('textbox');
        this.prompt = document.getElementById('prompt');
        this.top = document.getElementById('top');
        this.middle = document.getElementById('middle');
        this.bottom = document.getElementById('bottom');

        this.input.addEventListener('keypress', ev => this.handle_input(ev));
        this.input.focus();
    }
    handle_input () {
        if (event.charCode === 13) {
            this.controller.notify_input(this.input.value);
            this.input.value="";
        }
    }
    update_textbox (event) {
        let notif = document.createElement('p');
        notif.textContent = event.new_value;
        this.textbox.appendChild(notif);
        this.textbox.scrollTop = this.textbox.scrollHeight;
    }
    update_prompt (event) {
        let prompt = `${event.new_value}@netrunner:/lobby/>`;
        this.prompt.innerHTML = prompt;
    }
    update_players_list (event) {
        console.log('new player', event);
        let player_info = document.createElement('p');
        player_info.textContent = `[${event.new_value.name}]`;
        this.top.appendChild(player_info);
    }
};

//-----------------------------------------------------------------------------
anr.controllers.Lobby = class extends anr.framework.Controller {
    constructor (client) {
        super(client);
        this.model = new anr.models.Lobby ();
        this.view = new anr.views.Lobby(this, this.model);
    }
    notify_input(input) {
        this.model.notifications.push(input);
    }

    connect (msg) {
        console.log('initial message', msg.content);
        this.model.name.set(msg.content.name);
        for (let player of msg.content.users_list) {
            this.model.players.push(player);
        }
        console.log('mesg', msg);
        this.client.send({type:'prout'});
    }

    read (msg) {
        if (msg.type === 'new_player') {
            this.model.players.push(msg.content);
        }
    }
};

