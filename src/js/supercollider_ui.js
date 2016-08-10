$(document).ready(function() {
    // handle css
    socket.on('/cli/css', function(msg){
        $(msg[0]).css(msg[1], msg[2]);
    });

    // handle redirect
    socket.on('/cli/redirect', function(msg){
        console.log("redirect to: " + msg);
        window.location.href = msg;
    });

    // handle reload
    socket.on('/cli/reload', function(){
        window.location.reload();
    });

    // handle title
    socket.on('/cli/title', function(msg){
        $("h1 #title").html(msg);
    });
});
