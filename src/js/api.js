var io = require('socket.io-client');
var socket = io();

function cli_path(path) { return "/cli" + path; }
function node_path(path) { return "/node" + path; }
function sc_path(path) { return "/sc" + path; }

var debug = false;
var DEFAULT_STATE = {'boot': false, 'record': false, 'mute': true, 'volume': 0 };
var server_state = DEFAULT_STATE;

function api_send_to_sc(socket, path) {
    var args = [sc_path(path)].concat(Array.prototype.slice.call(arguments, 2));
    if(debug) console.log(args);
    socket.emit("/forward", args);
}

function api_from_sc(socket, path, func) {
    socket.on(cli_path(path), func);
}

function check_for_promise(resolve, reject, msg, time) {
    if(!time) time = 2000;

    socket.on('/cli/supercollider', function(msg) {
        if(msg[0] == "state") {
            var state = JSON.parse(msg[1]);
            if(!state) {
                reject(new Error("invalid JSON!"));
            }

            resolve(state);
        }
    });

    setTimeout(function() { reject(new Error(msg)); }, time);
}

// returns server state
function promise_get_state() {
    return new Promise(function(resolve, reject) {
        socket.emit('/node/supercollider', ['state?']);
        check_for_promise(resolve, reject, "get state timeout!");
    });
}

function api_get_supercollider_state(func) {
    promise_get_state()
    .then(
        function(state){
            server_state = state;
            if(func) func(state);
        },
        function(error){
            server_state = DEFAULT_STATE;
            if(func) func(state);
            console.log("[API]: ", error.message);
        }
    );
}

function promise_mute(state) {
    return new Promise(function(resolve, reject) {
        socket.emit('/node/supercollider', ['mute', state]);
        check_for_promise(resolve, reject, "mute timeout!", 1000);
    });
}

function api_mute_supercollider(state, func) {
    promise_mute(state)
    .then(
        function(state) {
            mute_state = state;
            if(func) func(state);
        },
        function(error) {
            mute_state = 0;
            if(func) func(state);
            console.log("[API]: ", error.message);
        }
    );
}

function api_mute_toggle_supercollider(func) {
    if(server_state.mute) {
        api_mute_supercollider(0, func);
    }    else {
        api_mute_supercollider(1, func);
    }
}

function api_set_supercollider_volume(volume) {
    socket.emit('/node/supercollider', ['volume', volume]);
}

function promise_boot_supercollider() {
    return new Promise(function(resolve, reject) {
        socket.emit('/node/supercollider', ['boot', 1]);
        check_for_promise(resolve, reject, "boot timeout!", 3000);
    });
}

function promise_get_booted() {
    return promise_get_state()
    .then(
        function(state){
            if(!state.boot) {
                return promise_boot_supercollider();
            }
            return DEFAULT_STATE;
        }
    );
}

function api_boot_supercollider(func) {
    promise_get_booted()
    .then(
        function(state) {
            server_state = state;
            if(func) func(state);
        },
        function(error) {
            server_state = DEFAULT_STATE;
            if(func) func(state);
            console.log("[API]: ", error.message);
        }
    );
}

function promise_quit_supercollider() {
    return new Promise(function(resolve, reject) {
        socket.emit('/node/supercollider', ['boot', 0]);
        check_for_promise(resolve, reject, "quit timeout!", 3000);
    });
}

function api_quit_supercollider(func) {
    // 1. know sc state
    promise_get_state()
    .then(function(state) {
        // 2. try to stop record (if started)
        return promise_record(0);
    })
    .then(function(state) {
        // 3. quit sc
        return promise_quit_supercollider();
    })
    .then(
        function(state) {
            server_state = state;
            if(func) func(state);
        },
        function(error) {
            server_state = DEFAULT_STATE;
            console.log("[API]: " + error.message);
        }
    );
}

function api_toggle_supercollider(func) {
    if(server_state.boot) {
        api_quit_supercollider(func);
    } else {
        api_boot_supercollider(func);
    }
}

function promise_record(value) {
    return new Promise(function(resolve, reject) {
        socket.emit('/node/supercollider', ['record', value]);
        check_for_promise(resolve, reject, "record timeout!", 2000);
    });
}

function api_record_supercollider(func) {
    // first try to boot sc
    promise_get_booted()
    .then(
        function(state) { return promise_record(1); }
    )
    .then(
        function(state) {
            server_state = state;
            if(func) func(state);
        },
        function(error) {
            server_state = DEFAULT_STATE;
            if(func) func(state);
            console.log("[API]: ", error.message);
        }
    );
}

function api_record_stop_supercollider(func) {
    // try to stop sc record
    promise_get_state().
    then(
        function(state) {
            if(state.record) { return promise_record(0); }
            else { return record; }
        }
    )
    .then(
        function(state) {
            rserver_state = state;
            if(func) func(state);
        },
        function(error) {
            rserver_state = DEFAULT_STATE;
            if(func) func(state);
            console.log("[API]: ", error.message);
        }
    );
}

function api_record_toggle_supercollider(func) {
    if(server_state.record) {
        api_record_stop_supercollider(func);
    }
    else {
        api_record_supercollider(func);
    }
}

var update_subscribers = [];
function api_subscribe_update(func) {
    update_subscribers.push(func);
}

function init_sockets() {
    socket.on('/cli/supercollider', function(msg) {
        if(msg[0] == "state") {
            var json = JSON.parse(msg[1]);
            if(!json) {
                console.log("[API]: invalid JSON data");
                return;
            }
            // console.log(json);
            server_state = json;
            update_subscribers.forEach(function(func){
                func(server_state);
            });

        }
        else {
            console.log("[API]: unknown message: " + msg);
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
module.exports.sc_boot_toggle = api_toggle_supercollider;
module.exports.sc_state_request = api_get_supercollider_state;

// record
module.exports.sc_record = api_record_supercollider;
module.exports.sc_record_toggle = api_record_toggle_supercollider;

module.exports.sc_mute = api_mute_supercollider;
module.exports.sc_mute_toggle = api_mute_toggle_supercollider;
module.exports.sc_volume = api_set_supercollider_volume;

// bind actions
module.exports.subscribe = api_subscribe_update;

// utils
module.exports.cli_path = cli_path;
module.exports.node_path = node_path;
module.exports.sc_path = sc_path;
