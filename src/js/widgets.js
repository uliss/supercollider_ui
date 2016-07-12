function ui_make_default_params(params) {
    var defaults = {
        "x": 0,
        "y": 0,
        "name": params.idx,
        "parent": "ui-elements",
        "oscPath": "/nodejs/ui",
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

function ui_set_default(widget, params) {
    widget.label = params.label;
    widget.oscPath = params.oscPath;
    widget.colors = $.extend({}, widget.colors, params.colors);
}

function ui_make_button(params) {
    // default values
    if(!params.size)
        params.w = params.h = 60;
    else
        params.w = params.h = params.size;

    params = ui_make_default_params(params);
    var widget = nx.add("button", params);
    ui_set_default(widget, params);

    widget.mode = "single";
    widget.on('press', function(data) {
        socket.emit(params.oscPath, [widget.canvasID, data]);
    });

    return widget;
}

function ui_make_knob(params) {
    if(!params.size)
        params.w = 100;
    else
        params.w = params.size;

    params.h = params.w * 1.7;

    params = ui_make_default_params(params);
    var widget = nx.add("dial", params);

    if(params.min !== null) widget.min = params.min;
    if(params.max !== null) widget.max = params.max;

    ui_set_default(widget, params);

    widget.on('value', function(data){
        socket.emit(widget.oscPath, [widget.canvasID, data]);
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
