$(document).ready(function() {
    function PingServer() {
        this.interval = null;
        this.answered = false;

        this.run = function() {
            var el = $("#nav_ui_connection_indicator");
            socket.emit("/ping");

            interval = setInterval(function(){
                socket.emit("/ping");
                answered = false;

                setTimeout(function(){
                    if(!answered) {
                        el.removeClass("nav_ui_indicator_connected");
                        el.addClass("nav_ui_indicator_disconnected");
                    }

                }, 1000);
            }, 4000);

            socket.on('/pong', function(msg){
                el.removeClass("nav_ui_indicator_disconnected");
                el.addClass("nav_ui_indicator_connected");
                answered = true;
            });
        };
    }

    nav_menu_init();
    nav_menu_handle();

    var ping_server = new PingServer();
    ping_server.run();

    // handle css
    socket.on('/cli/css', function(msg){
        $(msg[0]).css(msg[1], msg[2]);
    });

    socket.on('/cli/alert', function(msg){
        var show_error = function(msg) {
            $('#ui_modal_error_title').text(msg.title);
            $('#ui_modal_error_text').text(msg.text);
            $('#ui_modal_error').modal({});
        };

        var show_ok = function(msg) {
            $('#ui_modal_ok_title').text(msg.title);
            $('#ui_modal_ok_text').text(msg.text);
            $('#ui_modal_ok').modal({});
        };

        var show_info = function(msg) {
            $('#ui_modal_info_title').text(msg.title);
            $('#ui_modal_info_text').text(msg.text);
            $('#ui_modal_info').modal({});
        };

        switch(msg.type) {
            case 'error': show_error(msg); break;
            case 'ok':    show_ok(msg); break;
            case 'info':  show_info(msg); break;
            default: { console.log('unknown alert type: ' + msg.type); }
        }
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
