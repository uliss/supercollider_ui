var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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

io.on('connection', function(socket){
    var addr = socket['conn']['remoteAddress'];
    console.log('connected:    ' + addr);

    socket.on('get_info', function(){
        console.log(socket);
        // console.log("get info");
        io.emit("info", socket['conn']['server']['clientsCount']);
    });

    socket.on('disconnect', function(){
        console.log('disconnected: ' + addr);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
