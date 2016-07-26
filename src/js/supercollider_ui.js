$(document).ready(function() {
    function PingServer() {
        this.interval = null;
        this.answered = false;

        this.run = function() {
            $("h1").addClass("connected_process");

            var menu_font_size = "20px";
            var drop_down = $('<div class="dropdown pull-right dropdown-menu-right text-primary">')
            .css("margin-right", "10px")
            .css("float", "right")
            .css("font-size", menu_font_size)
            .appendTo($("h1"));

            var drop_menu = $('<button class="btn btn-default dropdown-toggle glyphicon glyphicon-menu-hamburger"><span class="caret"/></button>')
            .css("opacity", 0.2)
            .attr("data-toggle", "dropdown")
            .attr("aria-haspopup", "true")
            .attr("aria-expanded", "false")
            .css("font-size", menu_font_size)
            .appendTo(drop_down);

            var link1 = $('<li><a href="/"><span class="glyphicon glyphicon-home"></span> Home</a></li>');
            var link2 = $('<li><a href="/timer"><span class="glyphicon glyphicon-time"></span> Timer</a></li>');
            var link3 = $('<li><a href="/vlabel"><span class="glyphicon glyphicon-tags"></span> Label</a></li>');
            var link4 = $('<li><a href="/vmetro"><span class="glyphicon glyphicon-hourglass"></span> Metronome</a></li>');
            var link5 = $('<li><a href="/ui"><span class="glyphicon glyphicon-th"></span> UI</a></li>');

            var actions = $('<ul class="dropdown-menu"/>')
            .css("font-size", menu_font_size)
            .append(link1)
            .append(link2)
            .append(link3)
            .append(link4)
            .append(link5)
            .appendTo(drop_down);

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

    var widgets = {};

    // handle widget remove
    socket.on('/cli/widget/remove', function(msg) {
        widgets[msg].destroy();
        delete widgets[msg];
        $("#" + msg).remove();
    });

    // handle widget update
    socket.on('/cli/widget/update', function(msg){
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
    socket.on('/cli/widget/add', function(msg){
        var params = msg;
        // console.log(params);

        if(!params.idx) console.log("ERROR: no widget id!");
        if(widgets[params.idx]) {
            console.log(widgets[params.idx]);
            console.log("ERROR: widget already on UI:" + params.idx);
            return;
        }

        var widget = null;

        switch(params.type) {
            case "button": {
                widget = ui_make_button(params);
            }
            break;
            case "crossfade": {
                widget = ui_make_crossfade(params);
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
            case "playcontrol": {
                ui_make_playcontrol(params);
            }
            break;
            case "matrix": {
                widget = ui_make_matrix(params);
            }
            break;
            case "toggle": {
                widget = ui_make_toggle(params);
            }
            break;
            case "pianoroll": {
                widget = ui_make_pianoroll(params);
            }
            break;
            case "life": {
                widget = ui_make_life(params);
            }
            break;
            case "image": {
                ui_make_image(params);
            }
            break;
            case "slideshow": {
                ui_make_slideshow(params);
            }
            break;
            case "position": {
                widget = ui_make_position(params);
            }
            break;
            case "tilt": {
                widget = ui_make_tilt(params);
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

    // handle widget command
    socket.on('/cli/widget/command', function(msg){
        if(!msg.idx) {
            console.log("ERROR: no widget id!");
            return;
        }

        var cmd = $("#" + msg.idx).data("oncommand");
        if(cmd) {
            cmd("#" + msg.idx, msg);
        }
        else {
            console.log("no function");
        }
    });
});
