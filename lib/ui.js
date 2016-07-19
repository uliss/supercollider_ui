/**
 *  User Interface module for SuperCollider via WebSockets
 *
 * transfer osc://node/widget/add => socket://widget/add

 * API IN:
 * /widget/add JSON
 * /widget/remove ID
 * /widget/update JSON
*/

var utils = require('./utils');
postln = utils.postln;
postmsg = utils.postmsg;
sc_path = utils.sc_path;
node_path = utils.node_path;
cli_path = utils.cli_path;

function httpGet(req, res) {
    res.sendFile('ui.html', {root: __dirname + '/../build/'});
}

var g_osc_server;
var g_osc_client;
var g_io;

function init(oscServer, oscClient, io) {
    g_osc_server = oscServer;
    g_osc_client = oscClient;
    g_io = io;
    registerOsc();
}

function send2Client(path, msg) {
    g_io.emit(cli_path(path), msg);
}

function send2Supercollider(path, id, msg) {
    g_osc_client.send(sc_path(path) + "/" + id, msg);
}

function node2Client(path, func) {
    g_osc_server.on(node_path(path), function(msg, rinfo) {
        if(!msg) {
            postln("ERROR! invalid message given");
            return;
        }

        var cli_msg = func(msg, rinfo);
        postln(node_path(path) + " => " + JSON.stringify(cli_msg));
        send2Client(path, cli_msg);
    });
}

function registerOsc() {
    node2Client("/widget/add",
        function(msg, rinfo) {
            if(msg.length < 2) {
                postln("ERROR! Argument required!");
                postln("Usage: /widget/add JSON");
                return;
            }

            return JSON.parse(msg[1]);
        }
    );

    node2Client("/widget/update",
        function(msg, rinfo) {
            if(msg.length < 2) {
                postln("ERROR! Argument required!");
                postln("Usage: /sc/widget/update JSON");
                return;
            }

            return JSON.parse(msg[1]);
        }
    );

    node2Client("/widget/remove", function(msg, rinfo) {
        return msg[1];
    });
}

function bindClient(socket) {
    socket.on(node_path('/ui'), function(msg) {
        postln('nexus UI: ' + JSON.stringify(msg));
        if(msg.length == 2) {
            send2Supercollider("/ui", msg[0], msg[1]);
        }
        else if (msg.length > 2) {
            send2Supercollider("/ui", msg[0], msg.slice(1));
        }
        else {
            send2Supercollider("/ui", msg, "");
        }
    });
}

module.exports.httpGet = httpGet;
module.exports.init = init;
module.exports.bindClient = bindClient;
