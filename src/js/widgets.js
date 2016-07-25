function sendUI2Node(path, msg) {
    socket.emit("/node" + path, msg);
}

function ui_make_params(params) {
    var defaults = {
        "x": 0,
        "y": 0,
        "name": params.idx,
        "value": 0,
        "parent": "ui-elements",
        "oscPath": "/ui",
        "colors": {
            "accent": "#ff5500",
            "accenthl": "#ff6f26",
            "border": "#e3e3e3",
            "borderhl": "#727272",
            "fill": "#eeeeee",
        }
    };

    return $.extend({}, defaults, params);
}

function ui_make_widget(type, params) {
    var p = ui_make_params(params);
    var widget = nx.add(type, p);

    widget.label = p.label;
    widget.oscPath = p.oscPath;
    widget.colors = $.extend({}, widget.colors, p.colors);
    if(p.min !== null) widget.min = p.min;
    if(p.max !== null) widget.max = p.max;
    if(p.value !== null) {
        widget.val.value = p.value;
        widget.value = p.value;
    }
    return widget;
}

function ui_bind_to_value(widget) {
    widget.on('value', function(data){
        sendUI2Node(widget.oscPath, [widget.canvasID, data]);
    });
}

function ui_make_button(params) {
    // default values
    if(!params.size)
    params.w = params.h = 100;
    else
    params.w = params.h = params.size;

    var widget = ui_make_widget("button", params);

    widget.mode = "single";
    widget.on('press', function(data) {
        sendUI2Node(params.oscPath, [widget.canvasID, data]);
    });

    return widget;
}

function ui_make_crossfade(params) {
    if(!params.size)
    params.w = 200;
    else
    params.w = params.size;

    params.h = params.w * 0.15;

    var widget = ui_make_widget("crossfade", params);
    widget.on('*', function(data) {
        console.log(data);
        sendUI2Node(params.oscPath, [widget.canvasID, data.L, data.R]);
    });
    return widget;
}

function ui_make_matrix(params) {
    if(!params.size)
    params.w = 200;
    else
    params.w = params.size;

    if(!params.row) params.row = 4;
    if(!params.col) params.col = 4;

    params.h = params.w;

    var widget = ui_make_widget("matrix", params);
    widget.row = params.row;
    widget.col = params.col;
    widget.init();
    widget.on('*', function(data) {
        if(data.row) {
            sendUI2Node(params.oscPath, [widget.canvasID, data.row, data.col, data.level]);
            // console.log(data.grid);
        }
    });
    return widget;

}

function ui_make_knob(params) {
    if(!params.size)
    params.w = 100;
    else
    params.w = params.size;

    params.h = params.w * 1.7;

    var widget = ui_make_widget("dial", params);
    ui_bind_to_value(widget);
    return widget;
}

function ui_make_pan(params) {
    if(!params.size) params.w = 60;

    params.min = -1.0;
    params.max = 1.0;
    params.colors = {
        accent: "#f1c40f",
        fill: "#e67e22",
        borderhl: "#FFF"
    };
    var widget = ui_make_knob(params);
    return widget;
}

function ui_make_toggle(params) {
    if(!params.size)
    params.w = params.h = 100;
    else
    params.w = params.h = params.size;

    var widget = ui_make_widget("toggle", params);
    ui_bind_to_value(widget);
    return widget;
}

function ui_make_pianoroll(params) {
    if(!params.size) params.w = 600;
    params.w = params.size;
    params.h = params.w / 4.0;

    var widget = ui_make_widget("keyboard", params);
    if(!params.octaves) params.octaves = 3;
    if(!params.mode) params.mode = "button";
    if(!params.midibase) params.midibase = 48;

    widget.octaves = params.octaves;
    widget.mode = params.mode;
    widget.midibase = params.midibase;

    widget.init();

    widget.on('midi', function(data) {
        var v = data.split(' ');
        send2Node(params.oscPath, [widget.canvasID, parseInt(v[0]), parseInt(v[1])]);
    });

    return widget;
}

function ui_make_life(params) {
    params.row = 10;
    params.col = 10;
    if(!params.time) params.time = 1000;
    var w = ui_make_matrix(params);
    w.on('*', function(data) {
        if(data.grid) {
            console.log(data.grid);
            sendUI2Node(params.oscPath, [w.canvasID, data.grid]);
        }
    });
    for(var i = 0; i < 10; i++) { w.matrix[i].fill(0);}

    var ctrl = $('<div class="ctrl"></div>');


    var btn1 = $("<button>")
    .attr("value", 0)
    .text("Start")
    .addClass("btn")
    .addClass("btn-lg")
    .addClass("btn-success")
    .data("start", 1)
    .click(
        function() {
            $(this).toggleClass("btn-success");
            $(this).toggleClass("btn-danger");
            if($(this).data("start") == 1) {
                $(this).data("start", 0);
                $(this).text("Stop");
                $(this).data("intervalId", setInterval(w.life, params.time));
            }
            else {
                $(this).data("start", 1);
                $(this).text("Start");
                clearInterval($(this).data("intervalId"));
            }
        }
    )
    .appendTo(ctrl);

    $("#" + w.canvasID).after(ctrl);
    return w;
}

function ui_make_image(params) {
    var cont = $('<div class="image">');
    var img = $("<img/>")
    .attr("src", params.url)
    .attr("id", params.idx)
    .data('oncommand', function(id, cmd){
        console.log("[widgets:image] command: " + id + " = " + JSON.stringify(cmd));
        if(cmd.url) {
            $(id).attr("src", cmd.url);
        }
    });

    if(params.width)
    img.attr("width", params.width);
    if(params.height)
    img.attr("height", params.height);

    img.appendTo(cont);
    cont.appendTo($("#" + params.parent));
}

function ui_make_slideshow(params) {
    // control ID
    var ctrl_sel = "#" + params.idx;

    // check for double insert
    if($(ctrl_sel).length > 0) {
        console.log("[slideshow]: already has element with such id: " + ctrl_sel);
        return;
    }

    var cont = $('<div class="slideshow"></div>')
    .css("position", "absolute")
    .css("top", "40vh")
    .css("width", "97vw")
    // .css("left", "2vw")
    .attr("id", params.idx)
    .data('oncommand', function(id, cmd) {
        // console.log("[widgets:image] command: " + id + " = " + JSON.stringify(cmd));
        if(cmd.url) {
            var win = $(window);
            var win_w = win.width();
            var win_h = win.height();
            var bgcolor = "#60646D";
            $bg = $("html");
            $bg.css("background-color", bgcolor);
            $bg.css("background-attachment", "fixed");
            $bg.css("background-position", "center center");
            $bg.css("background-repeat", "no-repeat");
            $bg.css("background-image", "url('" + cmd.url + "')");
            $bg.css("height", win_h + "px");
            $bg.css("width", win_w + "px");
            $bg.css("background-size", "contain");
            $("body, h1").css({'background-color': "transparent"});
        }
    });

    var opacity = 0.2;
    var size = "150px";
    var font_size = "50px";

    $(document).keydown(function(e) {
        if(e.keyCode == 32 || e.keyCode == 39) { sendUI2Node("/ui", [params.idx, "next"]);}
        if(e.keyCode == 37) { sendUI2Node("/ui", [params.idx, "prev"]);}
        if(e.keyCode == 35) { sendUI2Node("/ui", [params.idx, "last"]); }
        if(e.keyCode == 36) { sendUI2Node("/ui", [params.idx, "first"]); }
    });

    $('html').on('swipe', function(e, Dx, Dy){
        if(Dx == 1) { sendUI2Node("/ui", [params.idx, "next"]); }
        if(Dx == -1) { sendUI2Node("/ui", [params.idx, "prev"]); }
    });

    var prev = _widget_make_btn("", "step-backward")
    .css("bacgkround-color", "transparent")
    .css("opacity", opacity)
    .css("font-size", font_size)
    .css("float", "left")
    .css("height", size)
    .css("width", size)
    .click(function(){sendUI2Node("/ui", [params.idx, "prev"]);});
    cont.append(prev);
    var next = _widget_make_btn("", "step-forward")
    .css("bacgkround-color", "transparent")
    .css("opacity", opacity)
    .css("font-size", font_size)
    .css("float", "right")
    .css("height", size)
    .css("width", size)
    .click(function(){sendUI2Node("/ui", [params.idx, "next"]);});
    cont.append(next);

    cont.appendTo($("#" + params.parent));
}

function ui_make_slider(params) {
    if(!params.size) {
        params.w = 40;
        params.h = 200;
    }
    else {
        params.w = 40;
        params.h = params.size;
    }

    if(params.horizontal) {
        tmp = params.w;
        params.w = params.h;
        params.h = tmp;
    }

    var widget = ui_make_widget("slider", params);

    if(!params.relative) widget.mode = "absolute";
    if(params.horizontal) widget.hslider = true;

    ui_bind_to_value(widget);
    return widget;
}

function _widget_make_btn(text, icon) {
    var btn = $("<button>")
    .attr("value", 0)
    .attr("id", "ui-playcontrol-" + icon)
    .addClass("btn")
    .addClass("btn-lg");

    if(icon) {
        var label = $("<span>")
        .addClass("glyphicon")
        .addClass("glyphicon-" + icon);

        btn.append(label);
    }

    if(text) {
        btn.append(text);
    }

    return btn;
}

function PlaycontrolTimer(element) {
    this.currentTime = 0;
    this.timerId = null;
    this.element = element;
    this.isRunning = false;

    this.start = function() {
        this.isRunning = true;
        var self = this;
        this.timerId = setInterval(function(){
            self.next();
        }, 1000);
    };

    this.pause = function() {
        this.isRunning = false;
        clearInterval(this.timerId);
    };

    this.stop = function() {
        this.isRunning = false;
        clearInterval(this.timerId);
        this.reset();
    };

    this.reset = function() {
        this.currentTime = 0;
        this.update();
    };

    this.update = function() {
        this.element.text(this.currentTime .toHHMMSS());
    };

    this.next = function() {
        this.currentTime++;
        this.update();
    };

    this.setTime = function(tm) {
        this.currentTime = tm;
        if(this.isRunning) {
            this.pause();
            this.start();
        }
        this.update();
    };

    this.update();
}

function ui_process_playcontrol_command(id, cmd) {
    console.log("[playcontrol] command: " + id + " = " + JSON.stringify(cmd));
    // process "part" message
    if(cmd.part) { $(id + " .part").text(cmd.part); }

    // process "sync"
    if(cmd.sync) {
        console.log($(id).data("timer"));
        $(id).data("timer").setTime(cmd.sync);
    }

    if(cmd.state) {
        var ctrl = $(id).data("fsm");
        switch(cmd.state) {
            case "play": ctrl.play(); break;
            case "stop": ctrl.stop(); break;
            case "pause": ctrl.pause(); break;
            default: console.log("[playcontrol] unknown command: " + cmd.state);
        }
    }
}

function ui_make_playcontrol(params) {
    // set default values
    if(!params.oscPath) params.oscPath = "/ui";
    if(!params.idx) params.idx = "playcontrol";

    // control ID
    var ctrl_sel = "#" + params.idx;
    // check for double insert
    if($(ctrl_sel).length > 0) {
        console.log("[playcontrol]: already has element with such id: " + ctrl_sel);
        return;
    }

    // create container
    var w = $('<div class="ui-playcontrol"/>')
    .attr('id', params.idx)
    .data('oncommand', ui_process_playcontrol_command);

    // create Finite State Machine
    var fsm = StateMachine.create({
        initial: { state: 's_stop', event: 'init', defer: true },
        error: function(eventName, from, to, args, errorCode, errorMessage) {
            return 'event ' + eventName + ' was naughty :- ' + errorMessage;
        },
        events: [
            { name: 'startup', from: 'none',  to: 's_stop' },
            { name: 'stop',  from: 's_pause', to: 's_stop' },
            { name: 'stop',  from: 's_play',  to: 's_stop' },
            { name: 'play',  from: 's_stop',  to: 's_play' },
            { name: 'play',  from: 's_pause', to: 's_play' },
            { name: 'pause', from: 's_play',  to: 's_pause'  }
        ],
        callbacks: {
            oninit: function(event, from, to, msg) {
                console.log("init");
                $('#ui-playcontrol-play').prop('disabled',  false);
                $('#ui-playcontrol-pause').prop('disabled', true);
                $('#ui-playcontrol-stop').prop('disabled',  true);

                $('#ui-playcontrol-play').addClass('btn-success');

                $('#ui-playcontrol-pause').addClass('btn-default');
                $('#ui-playcontrol-stop').addClass('btn-default');
            },
            onplay:  function(event, from, to, msg) {
                console.log("play");
                $('#ui-playcontrol-play').prop('disabled',  true);
                $('#ui-playcontrol-pause').prop('disabled', false);
                $('#ui-playcontrol-stop').prop('disabled',  false);

                $('#ui-playcontrol-play').removeClass('btn-success');
                $('#ui-playcontrol-pause').addClass('btn-warning');
                $('#ui-playcontrol-stop').addClass('btn-danger');

                $('#ui-playcontrol-play').addClass('btn-default');
                $('#ui-playcontrol-pause').removeClass('btn-default');
                $('#ui-playcontrol-stop').removeClass('btn-default');

                sendUI2Node(params.oscPath, [params.idx, "play"]);
                $(ctrl_sel).data("timer").start();
            },
            onstop:  function(event, from, to, msg) {
                console.log("stop");
                $('#ui-playcontrol-play').prop('disabled',  false);
                $('#ui-playcontrol-pause').prop('disabled', true);
                $('#ui-playcontrol-stop').prop('disabled',  true);

                $('#ui-playcontrol-play').addClass('btn-success');
                $('#ui-playcontrol-pause').removeClass('btn-warning');
                $('#ui-playcontrol-stop').removeClass('btn-danger');

                $('#ui-playcontrol-play').removeClass('btn-default');
                $('#ui-playcontrol-pause').addClass('btn-default');
                $('#ui-playcontrol-stop').addClass('btn-default');

                sendUI2Node(params.oscPath, [params.idx, "stop"]);
                $(ctrl_sel).data("timer").stop();
            },
            onpause:  function(event, from, to, msg) {
                console.log("pause");
                $('#ui-playcontrol-play').prop('disabled',  false);
                $('#ui-playcontrol-pause').prop('disabled', true);
                $('#ui-playcontrol-stop').prop('disabled',  false);

                $('#ui-playcontrol-play').addClass('btn-success');
                $('#ui-playcontrol-pause').addClass('btn-warning');
                $('#ui-playcontrol-stop').addClass('btn-danger');

                sendUI2Node(params.oscPath, [params.idx, "pause"]);
                $(ctrl_sel).data("timer").pause();
            },
        }
    });
    // save FSM in widget
    w.data("fsm", fsm);

    // display staff
    if(params.display) {
        var display = $('<div class="label"/>');
        var part = $('<div class="part">&nbsp;</div>');
        var time = $('<div class="time">00:00:00</div>');
        display.append(part);
        display.append(time);
        w.append(display);

        var timer = new PlaycontrolTimer(time);
        w.data('timer', timer);
    }

    // create back buttons
    if(params.back) {
        var btn_fast_backward = _widget_make_btn("", "fast-backward")
        .click(function(){sendUI2Node("/ui", [params.idx, "first"]);});
        w.append(btn_fast_backward);

        var btn_backward = _widget_make_btn("", "step-backward")
        .click(function(){sendUI2Node("/ui", [params.idx, "prev"]);});
        w.append(btn_backward);
    }

    // create buttons
    var btn_play = _widget_make_btn("Play", "play")
    .click(function() {$(ctrl_sel).data("fsm").play();});

    var btn_pause = _widget_make_btn("Pause", "pause")
    .click(function(){$(ctrl_sel).data("fsm").pause();});

    var btn_stop = _widget_make_btn("Stop", "stop")
    .click(function(){$(ctrl_sel).data("fsm").stop();});

    w.append(btn_play);
    w.append(btn_pause);
    w.append(btn_stop);

    // create forward buttons
    if(params.forward) {
        var btn_forward = _widget_make_btn("", "step-forward")
        .click(function(){sendUI2Node("/ui", [params.idx, "next"]);});
        w.append(btn_forward);

        var btn_fast_forward = _widget_make_btn("", "fast-forward")
        .click(function(){sendUI2Node("/ui", [params.idx, "last"]);});
        w.append(btn_fast_forward);
    }

    // DO NOT change order!
    $("#ui-elements").append(w);
    w.data("fsm").init();
}
