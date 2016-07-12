function ui_make_params(params) {
    var defaults = {
        "x": 0,
        "y": 0,
        "name": params.idx,
        "value": 0,
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

function ui_make_widget(type, params) {
    p = ui_make_params(params);
    var widget = nx.add(type, p);

    widget.label = p.label;
    widget.oscPath = p.oscPath;
    widget.colors = $.extend({}, widget.colors, p.colors);
    if(p.min !== null) widget.min = p.min;
    if(p.max !== null) widget.max = p.max;
    if(p.value !== null) widget.val.value = p.value;
    return widget;
}

function ui_bind_to_value(widget) {
    widget.on('value', function(data){
        socket.emit(widget.oscPath, [widget.canvasID, data]);
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
