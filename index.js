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

const NODE_PORT = 3000;
const OSC_IN_PORT = 5000;
const OSC_OUT_PORT = OSC_IN_PORT + 1;
const PID_FILE = "/usr/local/var/run/supercollider-ui.pid";

var log = utils.log;

var APP_GLOBAL = {};
APP_GLOBAL.http = http;
APP_GLOBAL.app = app;
APP_GLOBAL.io = io;

try {
    // handle Ctrl+C terminate
    process.on('SIGINT', function() {
        process.exit(2);
    });

    var pid = npid.create(PID_FILE);
    pid.removeOnExit();

    var oscServer = new osc.Server(OSC_IN_PORT, '0.0.0.0');
    var oscClient = new osc.Client('127.0.0.1', OSC_OUT_PORT);
    var serverTimer = new timer.ServerTimer(io, '/server/timer');

    APP_GLOBAL.osc = {};
    APP_GLOBAL.osc.server = oscServer;
    APP_GLOBAL.osc.client = oscClient;

    mod_server.init(APP_GLOBAL);
    // ui.init(oscServer, oscClient, io);
    // sounds.init();

    io.on('connection', function(socket) {
        mod_server.bindSocket(APP_GLOBAL, socket);

        //
        // // socket.on(serverTimer.controlPath, function(msg) {
        // //     timer.control(socket, serverTimer, msg);
        // // });
        //

        // ui.bindClient(socket);
        // ping.bindSocket(io, socket);
        // sounds.bindSocket(io, socket);
    });

    http.listen(NODE_PORT, function() {
        log.info('listening HTTP on *:' + NODE_PORT);
        log.info('listening OSC on *:' + OSC_IN_PORT);
        log.info('sending OSC to localhost:' + OSC_OUT_PORT);
        mod_server.notifyOnBoot(APP_GLOBAL);
    });
} catch (err) {
    log.error(err.message);
    process.exit(1);
}
