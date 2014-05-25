'use strict';

//-----------------------------------------------------------------------------
anr.models.Lobby = class extends anr.framework.Model {
    constructor (...args) {
        super(...args);
        this.add_list_property('notifications');
    }
};

//-----------------------------------------------------------------------------
anr.views.Lobby = class extends anr.framework.View {
    constructor (controller, notifications) {
        super(controller);

        notifications.addListener('add:notifications', 
                                    this.update_textbox.bind(this));
        this.input = document.getElementById('command-prompt');
        this.textbox = document.getElementById('textbox');
        this.input.addEventListener('keypress', this.handle_input.bind(this));
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
};

//-----------------------------------------------------------------------------
anr.controllers.Lobby = class extends anr.framework.Controller {
    constructor () {
        this.model = new anr.models.Lobby ();
        this.view = new anr.views.Lobby(this, this.model);
    }
    notify_input(input) {
        this.model.notifications.push(input);
    }

    connect (msg, socket) {
        console.log('initial message', msg.data);
    }
    read (msg) { // from web_socket
        console.log(msg);
    }
};

