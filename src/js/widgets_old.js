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
