var io = require('socket.io-client');
var socket = io();

function cli_path(path) { return "/cli" + path; }
function node_path(path) { return "/node" + path; }
function sc_path(path) { return "/sc" + path; }

var debug = false;
var server_state = 0;
var mute_state = 0;

function api_send_to_sc(socket, path) {
    var args = [sc_path(path)].concat(Array.prototype.slice.call(arguments, 2));
    if(debug) console.log(args);
    socket.emit("/forward", args);
}

function api_from_sc(socket, path, func) {
    socket.on(cli_path(path), func);
}

// returns boot state
function promise_api_get_supercollider_state() {
    return new Promise(function(resolve, reject) {
        socket.emit('/node/supercollider', ['state?']);
        socket.on('/cli/supercollider', function(msg) {
            if(msg[0] == "boot") { resolve(1); }
            if(msg[0] == "quit") { resolve(0); }
        });

        setTimeout(function() { reject(new Error("get state timeout!")); }, 1000);
    });
}

function api_get_supercollider_state(func) {
    promise_api_get_supercollider_state()
    .then(
        function(state){
            server_state = state;
            if(func) func(state);
        },
        function(error){
            server_state = 0;
            console.log(error.message);
        }
    );
}

function promise_api_mute_supercollider(state) {
    return new Promise(function(resolve, reject) {
        socket.emit('/node/supercollider', ['mute', state]);
        resolve(state);
    });
}

function api_mute_supercollider(state, func) {
    promise_api_mute_supercollider(state)
    .then(
        function(state) {
            mute_state = state;
            if(func) func(state);
        },
        function(error) {
            mute_state = 0;
            console.log(error.message);
        }
    );
}

function api_mute_toggle_supercollider(func) {
    if(mute_state == 1)
    api_mute_supercollider(0, func);
    else
    api_mute_supercollider(1, func);
}


function promise_api_boot_supercollider() {
    return new Promise(function(resolve, reject) {
        socket.emit('/node/supercollider', ['boot']);
        socket.on('/cli/supercollider', function(msg) {
            if(msg[0] == "boot") { resolve(1); }
        });

        setTimeout(function() { reject(new Error("boot timeout!"));}, 3000);
    });
}

function api_boot_supercollider(func) {
    promise_api_get_supercollider_state()
    .then(function(state) {
        if(!state) {
            return promise_api_boot_supercollider();
        }
        else {
            return 1;
        }
    })
    .then(
        function(state) {
            server_state = state;
            if(func) func(state);
        },
        function(error) {
            server_state = 0;
            console.log(error.message);
        }
    );
}

function promise_api_quit_supercollider() {
    return new Promise(function(resolve, reject) {
        socket.emit('/node/supercollider', ['quit']);
        socket.on('/cli/supercollider', function(msg) {
            if(msg[0] == "quit") { resolve(0); }
        });

        setTimeout(function() { reject(new Error("quit timeout!")); }, 3000);
    });
}

function api_quit_supercollider(func) {
    promise_api_quit_supercollider()
    .then(
        function(state) {
            server_state = state;
            if(func) func(state);
        },
        function(error) {
            server_state = 0;
            console.log(error.message);
        }
    );
}

function api_toggle_supercollider(func) {
    if(server_state == 1)
    api_quit_supercollider(func);
    else
    api_boot_supercollider(func);
}

var socket_bindings = {};

function api_bind_action(path, func) {
    if(socket_bindings[path] === undefined) {
        socket_bindings[path] = [];
    }

    socket_bindings[path].push(func);
}

function init_sockets() {
    var perform_action = function (name, value) {
        if(socket_bindings[name]) {
            socket_bindings[name].forEach(function(func) {
                func(value);
            });
        }
    };

    socket.on('/cli/supercollider', function(msg) {
        var func;
        switch(msg[0]) {
            case 'boot':
            case 'quit':
            case 'volume':
            case 'mute':
            perform_action('on' + msg[0], msg[1]);
            break;
            default: {
                console.log('[/cli/supercollider] unknown message: ' + msg);
            }
        }
    });
}

init_sockets();
// global socket
module.exports.socket = socket;

// forward
module.exports.send_to_sc = api_send_to_sc;
module.exports.from_sc = api_from_sc;

// supercollider server state control
module.exports.sc_boot = api_boot_supercollider;
module.exports.sc_quit = api_quit_supercollider;
module.exports.sc_mute = api_mute_supercollider;
module.exports.sc_mute_toggle = api_mute_toggle_supercollider;
module.exports.sc_toggle = api_toggle_supercollider;
module.exports.sc_state_request = api_get_supercollider_state;

// bind actions
module.exports.bind = api_bind_action;

// utils
module.exports.cli_path = cli_path;
module.exports.node_path = node_path;
module.exports.sc_path = sc_path;
