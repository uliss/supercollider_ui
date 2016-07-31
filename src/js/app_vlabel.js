var fittext = require('fittext.js');

var socket = null;

function vlabel_init(io_socket) {
    socket = io_socket;
}

function vlabel_run() {
    $(document).ready(
        function(){
            socket.on('/vlabel/set', function(msg){
                $("#label").html(msg);
                $("#label").fitText(0.5);
            });

            socket.on('/vlabel/css', function(msg){
                $("#label").css(msg[0], msg[1]);
            });
            // init
            $("#label").fitText(0.5);
        }
    );
}

module.exports.init = vlabel_init;
module.exports.run = vlabel_run;
