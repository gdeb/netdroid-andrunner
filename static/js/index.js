'use strict';

window.addEventListener("DOMContentLoaded", function () {
    // create client
    // let client = new anr.Client();
    // client.start()
});

let test = 'brolbrol';
console.log(test);
window.addEventListener("DOMContentLoaded", start);

// import * from 'EventEmitter';
// console.log('ntnsrt', y);
// let event_emitter = System.get('EventEmitter');
// console.log(event_emitter);
// function() {

//     console.log('dom loaded');
//     var main = document.getElementsByClassName("main");
//     console.log('main', main.length);
// }, false);


// var main = document.getElementsByClassName("main");
// console.log('main', main.length);
// console.log('test fm');


// class Greeter {
//     constructor(message) {
//       this.message = message;
//     }

//     greet() {
//       console.log(this.message);
//     mk  console.log(`yep ${this.message} mauiers`);
//     }
// }

// let greeter = new Greeter('Hello, world!');
// greeter.greet();

function start () {
  bindInput();
  let c = new WebSocket(`ws://${window.location.hostname}:8080`);
  c.onopen = () => c.send('prout ma chère');
  c.onmessage = (msg) => console.log('received: ' + JSON.parse(msg.data).yopla);
  // c.onopen = function () {c.send('prout'); };
}

function bindInput() {
  let input = document.getElementsByClassName('command-prompt')[0];
  input.addEventListener('keypress', function () {
    if (event.charCode === 13) {
      console.log('yep');
      console.log(input.value);
      let textbox = document.getElementsByClassName('textbox')[0];
      let line = document.createElement('p');
      line.textContent = input.value;

      textbox.appendChild(line);
      textbox.scrollTop = textbox.scrollHeight;
      input.value="";
    }
  });
  input.focus();
}