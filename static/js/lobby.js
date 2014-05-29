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
        model.addListener('reset:players', ev => this.reset_player(ev));
        model.addListener('add:players', ev => this.add_player(ev));

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
    add_player_to_list (player) {
        let player_info = document.createElement('p');
        player_info.textContent = `[${player.name}]`;
        this.top.appendChild(player_info);
    }
    add_notification (notif) {
        let notif_elem = document.createElement('p');
        notif_elem.textContent = `${notif}`;
        this.textbox.appendChild(notif_elem);        
    }
    add_player (event) {
        this.add_player_to_list (event.new_value);
        this.add_notification(`[${event.new_value.name}] joined the lobby`);
    }
    reset_player (event) {
        for (let player of event.new_value) {
            this.add_player_to_list(player);
        }
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
        this.model.name.set(msg.content.name);
        this.model.players.reset(msg.content.users_list);
        this.client.send({type:'prout'});
    }

    read (msg) {
        if (msg.type === 'new_player') {
            this.model.players.push(msg.content);
        }
    }
};

