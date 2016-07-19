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
        console.log(data);
        sendUI2Node(params.oscPath, [widget.canvasID, data.row, data.col, data.level]);
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
