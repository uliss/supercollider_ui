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

        var sockPath;
        if(widget.sockPath) sockPath = widget.sockPath;
        var label;
        if(widget.label !== null) label = widget.label;

        var min = 0, max = 1, value = 0;
        if(widget.min !== null) min = widget.min;
        if(widget.max !== null) max = widget.max;
        if(widget.value) value = widget.value;

        if(!widget.idx) console.log("ERROR: no widget id!");

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
            case "knob": {
                var knob = nx.add("dial", { "x" : x, "y" : y, "w" : wd,
                    "name": widget.idx, "parent": "ui-elements"});

                // knob.min = min;
                // knob.max = max;
                knob.label = label;
                knob.val.value = value;
                knob.draw();

                if(!sockPath) sockPath = "/nodejs/ui";
                knob.oscPath = sockPath;
                knob.on('value', function(data){
                    socket.emit(sockPath, [knob.canvasID, data]);
                });

                console.log(knob);
            }
            break;
            case "pan": {
                // default value
                if(!widget.width) wd = 60;
                if(!widget.height) ht = 105;

                var pan = nx.add("dial", { "x" : x, "y" : y,
                    "h": ht, "w" : wd,
                    "name": widget.idx, "parent": "ui-elements"});

                pan.min = -1.0;
                pan.max = 1.0;
                pan.label = label;
                pan.val.value = value;
                pan.colors.borderhl = "#FFF";
                pan.colors.accent = "#f1c40f";
                pan.colors.fill = "#e67e22";
                pan.draw();

                if(!sockPath) sockPath = "/nodejs/ui";
                pan.oscPath = sockPath;
                pan.on('value', function(data){
                    socket.emit(sockPath, [pan.canvasID, data]);
                });

                widgets[widget.idx] = pan;
                console.log(pan);
            }
            break;
            default:
                alert("unknown widget");
            break;
        }
    });
});
