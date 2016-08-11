function ui_make_multitouch(params) {
    if(!params.size)
    params.w = 300;
    else
    params.w = params.size;

    params.h = params.w;

    if(params.width) params.w = params.width;
    if(params.height) params.w = params.height;

    var widget = ui_make_widget("multitouch", params);
    if(params.text) widget.text = params.text;
    if(params.mode) widget.mode = params.mode;
    if(params.rows) widget.rows = params.rows;
    if(params.cols) widget.cols = params.cols;
    if(params.matrixLabels) widget.matrixLabels = params.matrixLabels;

    widget.on('*', function(data) {
        sendUI2Node(params.oscPath, [widget.canvasID, JSON.stringify(data)]);
    });
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

function ui_make_sc_button(params) {
    var sel = "#sc_button";
    if($(sel).length > 0) {
        console.log("[sc_button]: already sc_button on page");
        return;
    }

    function set_state(obj, state) {
        if(state) {
            obj.data("state", 1);
            obj.removeClass("glyphicon-volume-off");
            obj.addClass("glyphicon-volume-up");
        }
        else {
            obj.data("state", 0);
            obj.removeClass("glyphicon-volume-up");
            obj.addClass("glyphicon-volume-off");
            obj.css("color", "#34495e");
        }
    }

    var w = $('<button id="sc_button" class="btn btn-default glyphicon glyphicon-volume-off"><span></span></button>')
    .css("height", "100px")
    .css("width", "100px")
    .css("font-size", "4.1em")
    .css("opacity", 0.8)
    .css("background", "transparent")
    .css("color", "#34495e")
    .data("state", 0)
    .data("oncommand", function(id, data) {
        var el = $(sel);
        if(data.state == 1) { el.css("color", "#1dd2af"); }
        set_state(el, data.state == 1);
    })
    .click(function(e) {
        var el = $(sel);
        set_state(el, el.data("state") !== 1);
        sendUI2Node(params.oscPath, ["sc_button", el.data("state")]);
    });

    w.appendTo($('#' + params.parent));
}
