var ping_interval_obj = null;
var ping_answered = false;

function ping_start(socket, time) {
    if(!time) time = 4000;

    var el = $("#nav_ui_connection_indicator");
    socket.emit("/node/ping");

    ping_interval_obj = setInterval(function(){
        socket.emit("/node/ping");
        ping_answered = false;

        setTimeout(function(){
            if(!ping_answered) {
                el.removeClass("nav_ui_indicator_connected");
                el.addClass("nav_ui_indicator_disconnected");
            }
        }, 1000);
    }, time);

    socket.on('/cli/pong', function(msg) {
        el.removeClass("nav_ui_indicator_disconnected");
        el.addClass("nav_ui_indicator_connected");
        ping_answered = true;
    });
}

module.exports.start = ping_start;
