var inherits = require('inherits');
var knob = require('./knob.js');

function prepareParams(params) {
    if(!params.size)
    params.w = 60;
    else
    params.w = params.size;

    params.h = params.w * 1.2;

    params.min = -1.0;
    params.max = 1.0;
    params.colors = {
        // accent: "#f1c40f",
        // fill: "#e67e22",
        accent: "#19B5FE",
        // accent: "#e67e22",
        borderhl: "#FFF"
    };

    params.gap = 0.25;

    return params;
}

function Pan(params) {
    knob.Knob.call(this, params);
}

inherits(Pan, knob.Knob);

function create(params) {
    params = prepareParams(params);
    var w = new Pan(params);
    w.nx_widget.widgetStyle = 'handle';
    w.nx_widget.angleGap = 0.25;
    w.nx_widget.responsivity = 0.009;
    // w.nx_widget.makeRoomForLabel();
    w.nx_widget.canvas.ondblclick = function() { w.nx_widget.set({'value': 0}, true); w.nx_widget.init(); };
    w.nx_widget.init();
    w.bindToValue();
    return w;
}

module.exports.create = create;
