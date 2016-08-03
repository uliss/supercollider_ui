var io = require('socket.io-client');
var socket = io();

var debug = false;

function send_to_sc(socket, path) {
    var args = [sc_path(path)].concat(Array.prototype.slice.call(arguments, 2));
    if(debug) console.log(args);
    socket.emit("/forward", args);
}

function from_sc(socket, path, func) {
    socket.on(cli_path(path), func);
}


// forward
module.exports.send_to_sc = send_to_sc;
module.exports.from_sc = from_sc;

// socket
module.exports.socket = socket;
