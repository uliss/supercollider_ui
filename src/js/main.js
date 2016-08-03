var menu = require('./menu.js');
var alerts = require('./alerts.js');
var ping = require('./ping.js');
var app_tone = require('./app_tone.js');
var app_timer = require('./app_timer.js');
var app_vlabel = require('./app_vlabel.js');
var app_latency = require('./app_latency.js');

var g_socket;

menu.init();
alerts.init();
ping.start(4000);

window.app_tone_run = app_tone.main;
window.app_timer_run = app_timer.main;
window.app_vlabel_run = app_vlabel.main;
window.app_latency_run = app_latency.main;
