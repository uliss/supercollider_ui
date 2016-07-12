function ui_make_default_params(params) {
    var defaults = {
        "x": 0,
        "y": 0,
        "name": params.idx,
        "parent": "ui-elements",
        "oscPath": "/nodejs/ui"
    };

    return $.extend({}, defaults, params);
}

function ui_make_button(params) {
    // default values
    if(!params.size)
        params.w = params.h = 60;
    else
        params.w = params.h = params.size;

    var widget = nx.add("button", ui_make_default_params(params));
    widget.mode = "single";
    widget.label = params.label;
    widget.oscPath = params.oscPath;

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

    var widget = nx.add("dial", ui_make_default_params(params));

    if(params.min !== null) widget.min = params.min;
    if(params.max !== null) widget.max = params.max;
    if(params.value) widget.val.value = params.value;

    widget.label = params.label;
    widget.oscPath = params.oscPath;

    widget.on('value', function(data){
        socket.emit(widget.oscPath, [widget.canvasID, data]);
    });

    return widget;
}
