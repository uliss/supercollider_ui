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
        var widget = msg;
        console.log(widget);

        var x = 0, y = 0, ht = 100, wd = 100;
        if(widget.x) x = widget.x;
        if(widget.y) y = widget.y;
        if(widget.height) ht = widget.height;
        if(widget.width) wd = widget.width;

        var sockPath = "/nodejs/ui";
        if(widget.sockPath) sockPath = widget.sockPath;
        var label;
        if(widget.label !== null) label = widget.label;

        var min = 0, max = 1, value = 0;
        if(widget.min !== null) min = widget.min;
        if(widget.max !== null) max = widget.max;
        if(widget.value) value = widget.value;

        var parent = "ui-elements";
        if(widget.parent) parent = widget.parent;

        if(!widget.idx) console.log("ERROR: no widget id!");
        if(widgets[widget.idx]) {
            console.log("ERROR: widget already on UI");
            return;
        }

        var nwidget;

        switch(widget.type) {
            case "button": {
                nwidget = ui_make_button(widget);
            }
            break;
            case "knob": {
                nwidget = ui_make_knob(widget);
            }
            break;
            case "pan": {
                nwidget = ui_make_pan(widget);
            }
            break;
            case "slider": {
                if(!widget.size) {
                    if(!widget.width) wd = 35;
                    if(!widget.height) ht = 180;
                }
                else {
                    wd = 35;
                    ht = widget.size;
                }

                if(widget.horizontal) {
                    tmp = wd;
                    wd = ht;
                    ht = tmp;
                }

                var slider = nx.add("slider",  {"x" : x, "y" : y,
                    "h": ht, "w" : wd,
                    "name": widget.idx, "parent": "ui-elements"});

                if(min) slider.min = min;
                if(max) slider.max = max;

                if(!widget.relative) slider.mode = "absolute";
                if(widget.horizontal) slider.hslider = true;
                if(widget.value) slider.val.value = value;

                slider.on('value', function(data){
                    socket.emit(sockPath, [slider.canvasID, data]);
                });

                widgets[widget.idx] = slider;
                $("#" + widget.idx).css("margin", "0 5px");
            }
            break;
            case "newline": {
                $("#ui-elements").append("<div/>");
            }
            break;
            case "toggle": {
                // default values
                if(!widget.size) {
                    wd = 60;
                    ht = 60;
                }
                else {
                    wd = widget.size;
                    ht = widget.size;
                }

                nwidget = nx.add("toggle", { "x" : x, "y" : y,
                    "h": ht, "w" : wd,
                    "name": widget.idx, "parent": "ui-elements"});

                if(widget.value) nwidget.val.value = value;
                nwidget.draw();
                nwidget.on('value', function(data){
                    console.log(sockPath);
                    // console.log(data);
                    socket.emit(sockPath, [nwidget.canvasID, data]);
                });

                $("#" + widget.idx).css("margin", "0 5px");
            }
            break;

            default:
                alert("unknown widget");
            break;
        }

        if(nwidget) {
            console.log(nwidget);
            nwidget.draw();
            widgets[widget.idx] = nwidget;
        }
    });
});
