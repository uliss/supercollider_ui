var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var keypress = require('keypress');

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

app.get('/', function(req, res){
    res.sendFile(__dirname + '/build/index.html');
});

// serve CSS files
app.get('/css/*.css', function(req, res){
    res.sendFile(__dirname + '/build' + req['url']);
});

// serve JS lib files
app.get('/js/lib/*.js', function(req, res){
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
        io.emit("info", {
            clientsCount: io.engine.clientsCount,
            remoteAddress: addr
        });
    });

    // ping/pong
    socket.on('/ping', function(){ io.emit('/pong');});

    socket.on('disconnect', function(){
        console.log('disconnected: ' + addr);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
