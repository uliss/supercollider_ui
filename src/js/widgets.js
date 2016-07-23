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

function ui_make_playcontrol(params) {
    var w = $('<div id="ui-playcontrol"></div>');
    $("#ui-elements").append(w);

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

                sendUI2Node("/ui", ["playcontrol", "play"]);
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

                sendUI2Node("/ui", ["playcontrol", "stop"]);
            },
            onpause:  function(event, from, to, msg) {
                console.log("pause");
                $('#ui-playcontrol-play').prop('disabled',  false);
                $('#ui-playcontrol-pause').prop('disabled', false);
                $('#ui-playcontrol-stop').prop('disabled',  false);

                $('#ui-playcontrol-play').removeClass('btn-success');
                $('#ui-playcontrol-pause').addClass('btn-warning');
                $('#ui-playcontrol-stop').removeClass('btn-danger');

                $('#ui-playcontrol-play').addClass('btn-default');
                $('#ui-playcontrol-pause').removeClass('btn-default');
                $('#ui-playcontrol-stop').addClass('btn-default');

                sendUI2Node("/ui", ["playcontrol", "pause"]);
            },
        }
    });
    w.data("fsm", fsm);

    var btn_play = _widget_make_btn("Play", "play")
    .click(function() {$("#ui-playcontrol").data("fsm").play();});

    var btn_pause = _widget_make_btn("Pause", "pause")
    .click(function(){$("#ui-playcontrol").data("fsm").pause();});

    var btn_stop = _widget_make_btn("Stop", "stop")
    .click(function(){$("#ui-playcontrol").data("fsm").stop();});

    if(params.back) {
        var btn_fast_backward = _widget_make_btn("", "fast-backward")
        .click(function(){sendUI2Node("/ui", ["playcontrol", "begin"]);})
        w.append(btn_fast_backward);

        var btn_backward = _widget_make_btn("", "step-backward")
        .click(function(){sendUI2Node("/ui", ["playcontrol", "prev"]);})
        w.append(btn_backward);
    }

    w.append(btn_play);
    w.append(btn_pause);
    w.append(btn_stop);

    if(params.forward) {
        var btn_forward = _widget_make_btn("", "step-forward")
        .click(function(){sendUI2Node("/ui", ["playcontrol", "next"]);})
        w.append(btn_forward);

        var btn_fast_forward = _widget_make_btn("", "fast-forward")
        .click(function(){sendUI2Node("/ui", ["playcontrol", "end"]);})
        w.append(btn_fast_forward);
    }

    w.data("fsm").init();
}
