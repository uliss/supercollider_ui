var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var keypress = require('keypress');
var osc = require('node-osc');
var timer = require('./mod_timer');

var NODE_PORT = 3000;
var OSC_IN_PORT = 5000;
var OSC_OUT_PORT = OSC_IN_PORT + 1;


var S_options = {verbose: 1};

function postmsg(msg, prefix = '[NodeJS]: ') {
    console.log(prefix  +  msg);
}

function postln(msg) {
    if(S_options['verbose'] != 0) {
        postmsg(msg);
    }
}

Number.prototype.toHHMMSS = function () {
    var seconds = Math.floor(this),
    hours = Math.floor(seconds / 3600);
    seconds -= hours*3600;
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes*60;

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
};

try {
    var oscServer = new osc.Server(OSC_IN_PORT, '0.0.0.0');
    var oscClient = new osc.Client('127.0.0.1', OSC_OUT_PORT);
} catch(e) {
    throw new Error("Can't start OSC server");
};

// OSC
oscServer.on("/sc/stat", function (msg, rinfo) {
    var json = JSON.parse(msg[1]);
    // console.log(json);
    // send to browsers
    io.emit("/info/sc/stat/update", json);
});

oscServer.on("/server/set", function (msg, rinfo) {
    var k = msg[1];

    if(k == "help") {
        postmsg(msg[0] + ' KEY VALUE');
        postmsg('- sets server variable', '    ');
        return;
    }

    S_options[k] = msg[2];
    postmsg('SET ' + k + ' = ' + S_options[k]);
});

oscServer.on("/server/get", function (msg, rinfo) {
    var k = msg[1];
    var v = S_options[k];

    if(k == "help") {
        postmsg(msg[0] + ' KEY');
        postmsg('- reads server variable and sends it back to osc://localhost:' + OSC_OUT_PORT + '/server/get', '    ');
        return;
    }

    oscClient.send("/server/get", k, v);
    postmsg('var ' + k + ' == ' + v);
});

oscServer.on("/server/help", function (msg, rinfo) {
    postmsg("Available commands:");
    postmsg(["set", "get", "echo", "help"].map(function(v){return "/server/" + v}).join("\n    "), "    ");
});

oscServer.on("/server/echo", function (msg, rinfo) {
    postmsg(msg[1]);
});

oscServer.on("/sc/concert/info", function(msg, rinfo) {
    var json = JSON.parse(msg[1]);
    io.emit("/concert/info", json);
});

oscServer.on("/sc/vlabel/set", function(msg, rinfo) {
    // console.log("OSC: " + msg[1]);
    io.emit("/vlabel/set", msg[1]);
});

oscServer.on("/sc/concert/add", function(msg, rinfo) {
    var json = JSON.parse(msg[1]);
    io.emit("/concert/add", json);
});

app.get('/', function(req, res){
    res.sendFile(__dirname + '/build/index.html');
});

// serve CSS files
app.get('/css/*.css', function(req, res){
    res.sendFile(__dirname + '/build' + req['url']);
});

app.get('/css/bootstrap/fonts/*', function(req, res){
    res.sendFile(__dirname + '/build' + req['url']);
});

// serve JS lib files
app.get('/js/*.js', function(req, res){
    res.sendFile(__dirname + '/build' + req['url']);
});

app.get('/speakers', function(req, res) {
    res.sendFile(__dirname + '/build/speakers.html');
});

app.get('/info', function(req, res) {
    res.sendFile(__dirname + '/build/info.html');
});

app.get('/vlabel', function(req, res) {
    res.sendFile(__dirname + '/build/vlabel.html');
});

app.get('/concert', function(req, res) {
    res.sendFile(__dirname + '/build/concert.html');
});

// init timer staff
app.get('/timer', timer.httpGet);
var serverTimer = new timer.ServerTimer(io, '/server/timer');

io.on('connection', function(socket){
    var addr = socket.request.connection.remoteAddress.substring(7);
    postln('connected:    ' + addr);

    socket.on(serverTimer.controlPath, function(msg){
        timer.control(socket, serverTimer, msg);
    });

    socket.on('/nodejs/info', function(){
        // send to dedicated client
        io.to(socket.id).emit("/nodejs/info/update", {
            clientsCount: io.engine.clientsCount,
            remoteAddress: addr
        });
    });

    socket.on('/speakers/test', function(msg){
        // console.log("send " + msg);
        // send to other devices
        socket.broadcast.emit("/speakers/test/update", msg);
        oscClient.send('/nodejs/speaker/control', msg[0], msg[1]);
    });

    socket.on('/info/poll', function(msg){
        // send to other clients
        socket.broadcast.emit("/info/poll/update", msg);
        // send to supercollider
        // console.log(msg);
        oscClient.send('/nodejs/stat/control', msg);
    });

    socket.on("/concert/info/get", function(msg){
        postln("get info requiest");
        oscClient.send('/concert/info/get', msg);
    });

    socket.on("/concert/control", function(msg){
        postln(msg);
        oscClient.send('/concert/' + msg[0], msg[1]);
    });

    // ping/pong NodeJS
    socket.on('/ping', function(){ io.emit('/pong');});

    socket.on('disconnect', function(){
        postln('disconnected: ' + addr);
    });
});

http.listen(NODE_PORT, function(){
    postln('listening HTTP on *:' + NODE_PORT);
    postln('listening OSC on *:' + OSC_IN_PORT);
});
