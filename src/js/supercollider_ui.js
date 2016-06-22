$(document).ready(function() {
    function PingServer() {
        this.interval = null;
        this.answered = false;

        this.run = function() {
            $("h1").addClass("connected_process");

            var homelink = $("<a>")
            .attr("href", "/")
            .addClass("glyphicon")
            .addClass("glyphicon-home")
            .addClass("homelink")
            .appendTo($("h1"));

            interval = setInterval(function(){
                socket.emit("/ping");
                answered = false;

                setTimeout(function(){
                    if(!answered) {
                        $("h1").removeClass("connected_process");
                        $("h1").removeClass("connected");
                        $("h1").addClass("class", "disconnected");
                    }

                }, 1000);
            }, 4000);

            socket.on('/pong', function(msg){
                $("h1").removeClass("connected_process");
                $("h1").removeClass("disconnected");
                $("h1").addClass("connected");
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

    // handle redirect
    socket.on('/redirect', function(msg){
        console.log("redirect to: " + msg);
        window.location.href = msg;
    });

    // handle redirect
    socket.on('/reload', function(){
        window.location.reload();
    });

    // handle redirect
    socket.on('/title', function(msg){
        $("h1 #title").html(msg);
    });

    // handle redirect
    socket.on('/addWidget', function(msg){
        var widget = msg;
        console.log(widget);

        switch(widget.type) {
            case "button": {
                if(!widget.style) widget.style = "default";
                if(!widget.url)   widget.url = "/nodejs/button";
                if(!widget.x)     widget.x = "20px";
                if(!widget.y)     widget.y = "100px";
                if(!widget.act)   widget.act = "single";

                var btn = $('<input/>',
                    { type: "button", class: "commandButton", id: "btn_" + widget.idx, value: widget.label })
                .css("left", widget.x)
                .css("top", widget.y)
                .addClass("btn")
                .addClass("btn-lg")
                .addClass(widget.style);

                switch(widget.act) {
                    case "single":
                        btn.on('click', function(){socket.emit(widget.url, widget);});
                    break;
                    case "toggle":
                        btn.on('click', function(){
                            $(this).toggleClass('active');
                            widget.on = $(this).hasClass("active");
                            socket.emit(widget.url, widget);
                        });
                    break;
                    default:
                        console.log("Unkown button act:" + widget.act);
                        btn.on('click', function(){socket.emit(widget.url, widget);});
                    break;
                }


                if(widget.height) btn.css("height", widget.height);
                if(widget.width) btn.css("width", widget.width);
                if(widget.style) btn.addClass("btn-" + widget.style);

                if(widget.action) {
                    btn.on('click', function(){
                        setTimeout(widget.action, 0);
                    });
                }

                $("body").append(btn);
            }
            break;
            default:
                alert("unknown widget");
            break;
        }
    });
});
