var socket = io();

function get_info() {
    $("#info").text("...");
    socket.emit('get_info');
}

socket.on('info', function(msg){
    $("#info").text(msg);
});
