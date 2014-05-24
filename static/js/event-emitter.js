// let anr = {
//     framework: {},
//     lobby: {},
// };

// {
// let EventEmitter = class {
//     constructor () {
//         this.callbacks = {};
//         this.global_callbacks = {};
//     }
// };

// var anr.framework.EventEmitter = EventEmitter;
// }


var AbstractEventsDispatcher = function(){};
AbstractEventsDispatcher.prototype = {
callbacks: {},
global_callbacks: [],
bind: function(event_name, callback){
this.callbacks[event_name] = this.callbacks[event_name] || [];
this.callbacks[event_name].push(callback);
return this;// chainable
},
trigger: function(event_name, data){
this.dispatch(event_name, data);
this.dispatch_global(event_name, data);
return this;
},
 
bind_all: function(callback){
this.global_callbacks.push(callback);
return this;
},
bind_all_except: function(except, handler){
this.bind_all(function(event_name, event_data){
if(except.indexOf(event_name) > -1) return false;
handler(event_name, event_data)
});
return this
},
dispatch: function(event_name, data){
var chain = this.callbacks[event_name];
if(typeof chain == 'undefined') return; // no callbacks for this event
for(var i = 0; i < chain.length; i++){
chain[i]( data )
}
},
dispatch_global: function(event_name, data){
for(var i = 0; i < this.global_callbacks.length; i++){
this.global_callbacks[i]( event_name, data )
}
}
};
// let y = 3;

// module EventEmitter {
//     let test = "fuck milgrom";
//     export test;
// };


// // module EventEmitter {

// // let x = 3;
// // let test = "fuck milgrom";
// // export test;
// // };
// // // module "event-emitter" {

// // let x = 3;

// // let test = "fuck milgrom";

// // export test;




// // }