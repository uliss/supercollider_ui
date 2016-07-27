$(document).ready(function() {
    function PingServer() {
        this.interval = null;
        this.answered = false;

        this.run = function() {
            $("h1").addClass("connected_process");

            var main_menu = menu_create_main_menu();
            menu_create_sound_menu($("h1"));
            main_menu.appendTo($("h1"));

            jQuery("canvas").detach().appendTo('#sc_control_menu_volume');

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

    socket.on('/cli/supercollider', function(msg) {
        console.log(msg);
    });

    // handle css
    socket.on('/cli/css', function(msg){
        $(msg[0]).css(msg[1], msg[2]);
    });

    socket.on('/cli/modal/alert', function(msg){
        $('#ui_modal_alert_title').text(msg.title);
        $('#ui_modal_alert_text').text(msg.text);
        $('#ui_modal_alert').modal({});
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
            case "motion": {
                widget = ui_make_motion(params);
            }
            break;
            case "multitouch": {
                widget = ui_make_multitouch(params);
            }
            break;
            case "number": {
                widget = ui_make_number(params);
            }
            break;
            case "sc_button": {
                ui_make_sc_button(params);
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

        var el = $("#" + msg.idx);
        if(!el.length) {
            console.log("[command] element not found: " + msg.idx);
            return;
        }

        var cmd = el.data("oncommand");
        if(cmd) {
            cmd("#" + msg.idx, msg);
        }
        else {
            console.log("no function");
        }
    });
});
