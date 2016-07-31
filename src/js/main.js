var io = require('socket.io-client');
var menu = require('./menu.js');
var alerts = require('./alerts.js');
var ping = require('./ping.js');
var app_tone = require('./app_tone.js');
var app_timer = require('./app_timer.js');
var app_vlabel = require('./app_vlabel.js');

var g_socket;

$(document).ready(function() {
    g_socket = io();
    menu.init(g_socket);
    alerts.init(g_socket);
    app_tone.init(g_socket);
    app_timer.init(g_socket);
    app_vlabel.init(g_socket);

    ping.start(g_socket, 4000);
});

window.app_tone_run = app_tone.run;
window.app_timer_run = app_timer.run;
window.app_vlabel_run = app_vlabel.run;
