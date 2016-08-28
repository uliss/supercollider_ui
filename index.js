const url = require('url');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var osc = require('node-osc');
var timer = require('./lib/timer');
var mod_server = require('./lib/server');
var ui = require('./lib/ui');
var utils = require('./lib/utils');
var ping = require('./lib/ping');
var sounds = require('./lib/sound.js');
var npid = require('npid');

var NODE_PORT = 3000;
var OSC_IN_PORT = 5000;
var OSC_OUT_PORT = OSC_IN_PORT + 1;
var PID_FILE = "/usr/local/var/run/supercollider-ui.pid";

var postmsg = utils.postmsg;
var postln = utils.postln;

var server_globals = {};
server_globals.http = http;
server_globals.app = app;
server_globals.io = io;

try {
    var pid = npid.create(PID_FILE);
    pid.removeOnExit();

    var oscServer = new osc.Server(OSC_IN_PORT, '0.0.0.0');
    var oscClient = new osc.Client('127.0.0.1', OSC_OUT_PORT);
    var serverTimer = new timer.ServerTimer(io, '/server/timer');

    server_globals.osc = {};
    server_globals.osc.server = oscServer;
    server_globals.osc.client = oscClient;

    mod_server.init(app, oscServer, oscClient, io);
    ui.init(oscServer, oscClient, io);
    sounds.init();
} catch (err) {
    console.log(err.what);
    process.exit(1);
}

io.on('connection', function(socket) {
    mod_server.notify_SC_OnClientConnect(socket);

    // socket.on(serverTimer.controlPath, function(msg) {
    //     timer.control(socket, serverTimer, msg);
    // });

    mod_server.bindSocket(io, socket, oscClient);
    ui.bindClient(socket);
    ping.bindSocket(io, socket);
    sounds.bindSocket(io, socket);


    socket.on('disconnect', function() {
        postln('disconnected: ' + addr);
    });
});

http.listen(NODE_PORT, function() {
    postln('listening HTTP on *:' + NODE_PORT);
    postln('listening OSC on *:' + OSC_IN_PORT);
    postln('sending OSC to localhost:' + OSC_OUT_PORT);
    mod_server.notify_SC_OnBoot();
});
