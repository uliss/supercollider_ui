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

    var widgets = {};

    socket.on('/widget/remove', function(msg){
        $("#" + msg).remove();
        widgets[msg.idx] = null;
    });

    socket.on('/widget/update', function(msg){
        console.log(msg);
        if(!msg.idx) {
            console.log("ERROR: no widget id!");
            return;
        }

        if(msg.value) widgets[msg.idx].val.value = msg.value;
        if(msg.label) widgets[msg.idx].label = msg.label;
        widgets[msg.idx].draw();
    });

    // handle widget add
    socket.on('/widget/add', function(msg){
        var params = msg;
        console.log(params);

        if(!params.idx) console.log("ERROR: no widget id!");
        if(widgets[params.idx]) {
            console.log("ERROR: widget already on UI");
            return;
        }

        var widget = null;

        switch(params.type) {
            case "button": {
                widget = ui_make_button(params);
            }
            break;
            case "knob": {
                widget = ui_make_knob(params);
            }
            break;
            case "pan": {
                widget = ui_make_pan(params);
            }
            break;
            case "slider": {
                widget = ui_make_slider(params);
            }
            break;
            case "newline": {
                $("#ui-elements").append("<div/>");
            }
            break;
            case "toggle": {
                widget = ui_make_toggle(params);
            }
            break;
            default:
                alert("unknown widget");
            break;
        }

        if(widget) {
            console.log(widget);
            widget.draw();
            widgets[params.idx] = widget;
        }
    });
});
