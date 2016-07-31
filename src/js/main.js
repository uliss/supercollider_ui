var io = require('socket.io-client');
var menu = require('./menu.js');
var alerts = require('./alerts.js');
var ping = require('./ping.js');

$(document).ready(function() {
    var socket = io();
    menu.init(socket);
    alerts.init(socket);
    ping.start(socket, 4000);
});
