'use strict';

//-----------------------------------------------------------------------------
anr.models.Lobby = class extends anr.framework.Model {
    constructor (...args) {
        super(...args);
        this.add_property('name', 'anonymous');
        this.add_list_property('notifications');
    }
};

//-----------------------------------------------------------------------------
anr.views.Lobby = class extends anr.framework.View {
    constructor (controller, model) {
        super(controller);

        model.addListener('add:notifications', ev => this.update_textbox(ev));
        model.addListener('change:name', ev => this.update_prompt(ev));

        this.input = document.getElementById('command-prompt');
        this.textbox = document.getElementById('textbox');
        this.prompt = document.getElementById('prompt');
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
        console.log('mesg', msg);
        this.client.send({type:'prout'});
    }
};

