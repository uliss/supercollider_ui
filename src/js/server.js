var io = require('socket.io-client');
var socket = io();

var debug = false;

function send_to_sc(path) {
    var args = [sc_path(path)].concat(Array.prototype.slice.call(arguments, 2));
    if(debug) console.log(args);
    socket.emit("/forward", args);
}

function from_sc(path, func) {
    socket.on(cli_path(path), func);
}

function send(path) {
    var args = Array.prototype.slice.call(arguments, 0);
    if(args.length === 0)
        socket.emit("path");
    else
        socket.emit(path, args);
}

function on(path, callback) {
    socket.on(path, function(msg){
        callback(msg);
    });
}


module.exports.send = send;
module.exports.on = on;

// forward
module.exports.send_to_sc = send_to_sc;
module.exports.from_sc = from_sc;

// socket
module.exports.socket = socket;
