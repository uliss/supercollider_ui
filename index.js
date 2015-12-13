var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var keypress = require('keypress');
var osc = require('node-osc');

var NODE_PORT = 3000;
var OSC_IN_PORT = 5000;
var OSC_OUT_PORT = OSC_IN_PORT + 1;

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

app.get('/timer', function(req, res) {
    res.sendFile(__dirname + '/build/timer.html');
});

var timer_seconds = 0;
setInterval(function(){
    io.emit("timer1", timer_seconds .toHHMMSS());
    timer_seconds += 1;
}, 1000);

io.on('connection', function(socket){
    var addr = socket.request.connection.remoteAddress.substring(7);
    console.log('connected:    ' + addr);

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

    // ping/pong NodeJS
    socket.on('/ping', function(){ io.emit('/pong');});

    socket.on('disconnect', function(){
        console.log('disconnected: ' + addr);
    });
});

http.listen(NODE_PORT, function(){
    console.log('listening on *:' + NODE_PORT);
});
