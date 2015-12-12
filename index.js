var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var keypress = require('keypress');
var osc = require('node-osc');

var NODE_PORT = 3000;
var OSC_PORT = 3333;
var OSC_CLIENT_PORT = OSC_PORT + 1;

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
    var oscServer = new osc.Server(OSC_PORT, '0.0.0.0');
    var oscClient = new osc.Client('127.0.0.1', OSC_CLIENT_PORT);
} catch(e) {
    throw new Error("Can't start OSC server");
};

oscServer.on("/sc/stat", function (msg, rinfo) {
    var json = JSON.parse(msg[1]);
    // console.log(json);
    io.emit("/sc/stat", json);
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

    socket.on('get_info', function(){
        io.to(socket.id).emit("info", {
            clientsCount: io.engine.clientsCount,
            remoteAddress: addr
        });
    });

    socket.on('/info/poll', function(msg){
        socket.broadcast.emit("/info/poll/update", msg);
        oscClient.send('/sp/info/poll', msg);
        console.log(msg);
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
