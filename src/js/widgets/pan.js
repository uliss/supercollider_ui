var inherits = require('inherits');
var knob = require('./knob.js');

function prepareParams(params) {
    if(!params.size)
    params.w = 60;
    else
    params.w = params.size;

    params.h = params.w * 1.7;

    params.min = -1.0;
    params.max = 1.0;
    params.colors = {
        accent: "#f1c40f",
        fill: "#e67e22",
        borderhl: "#FFF"
    };

    return params;
}

function Pan(params) {
    knob.Knob.call(this, params);
}

inherits(Pan, knob.Knob);

function create(params) {
    params = prepareParams(params);
    var w = new Pan(params);
    w.bindToValue();
    return w;
}

module.exports.create = create;
