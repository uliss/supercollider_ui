var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/build/index.html');
});

app.get('/css/*.css', function(req, res){
    res.sendFile(__dirname + '/build' + req['url']);
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
