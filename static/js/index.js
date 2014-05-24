'use strict';

window.addEventListener("DOMContentLoaded", function () {
    let client = new anr.Client();
    client.start();
});


// function start () {
//   bindInput();
//   let c = new WebSocket(`ws://${window.location.hostname}:8080`);
//   c.onopen = () => c.send('prout ma chère');
//   c.onmessage = (msg) => console.log('received: ' + JSON.parse(msg.data).yopla);
//   // c.onopen = function () {c.send('prout'); };
// }

// function bindInput() {
//   let input = document.getElementsByClassName('command-prompt')[0];
//   input.addEventListener('keypress', function () {
//     if (event.charCode === 13) {
//       console.log('yep');
//       console.log(input.value);
//       let textbox = document.getElementsByClassName('textbox')[0];
//       let line = document.createElement('p');
//       line.textContent = input.value;

//       textbox.appendChild(line);
//       textbox.scrollTop = textbox.scrollHeight;
//       input.value="";
//     }
//   });
//   input.focus();
// }