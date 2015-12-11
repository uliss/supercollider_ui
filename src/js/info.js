var socket = io();

function get_info() {
    $(".info .clients").text("...");
    socket.emit('get_info');
}

$(document).ready(function() {
    socket.on('info', function(msg){
        $(".info .clients").text(msg.clientsCount);
        $(".info .remote-address").text(msg.remoteAddress);
    });
});
