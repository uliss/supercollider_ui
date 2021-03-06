$(document).ready(function() {
    function PingServer() {
        this.interval = null;
        this.answered = false;

        this.run = function() {
            $("h1").attr("class", "connected_process");

            var homelink = $("<a>")
            .attr("href", "/")
            .addClass("homelink")
            .addClass("glyphicon")
            .addClass("glyphicon-home")
            .appendTo($("h1"));

            interval = setInterval(function(){
                socket.emit("/ping");
                answered = false;

                setTimeout(function(){
                    if(!answered) {
                        $("h1").attr("class", "disconnected");
                    }
                }, 1000);
            }, 4000);

            socket.on('/pong', function(msg){
                $("h1").attr("class", "connected");
                answered = true;
            });
        };
    }

    var ping_server = new PingServer();
    ping_server.run();

    // handle css
    socket.on('/css', function(msg){
        $(msg[0]).css(msg[1], msg[2]);
    });

    // hangle redirect
    socket.on('/redirect', function(msg){
        console.log("redirect to: " + msg);
        window.location.href = msg;
    });
});
