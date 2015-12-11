$(document).ready(function() {
    function PingServer() {
        this.interval = null;
        this.answered = false;

        this.run = function() {
            $("h1").attr("class", "connected_process");

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
});
