var inherits = require('inherits');
var nxw = require('./nexuswidget.js');

function prepareParams(params) {
    if(!params.size)
    params.w = 100;
    else
    params.w = params.size;

    params.h = params.w * 1.7;

    return params;
}

function Knob(params) {
    nxw.NexusWidget.call(this, 'dial', params);
}

inherits(Knob, nxw.NexusWidget);

function create(params) {
    params = prepareParams(params);
    var w = new Knob(params);
    w.bindToValue();
    return w;
}

module.exports.create = create;
module.exports.Knob = Knob;
