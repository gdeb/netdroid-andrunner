'use strict';

anr.views.Lobby = class extends anr.framework.View {
    constructor () {
        this.input = document.getElementById('command-prompt');
        this.textbox = document.getElementById('textbox');
        this.input.addEventListener('keypress', this.handle_input.bind(this));
        this.input.focus();
    }
    handle_input () {
        if (event.charCode === 13) {
            let line = document.createElement('p');
            line.textContent = this.input.value;
            this.textbox.appendChild(line);
            this.textbox.scrollTop = this.textbox.scrollHeight;
            this.input.value="";
        }

    }
};

anr.controllers.Lobby = class extends anr.framework.Controller {
    constructor () {
        this.view = new anr.views.Lobby();
    }
};

