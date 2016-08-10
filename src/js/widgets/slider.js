var inherits = require('inherits');
var nxw = require('./nexuswidget.js');

function prepareParams(params) {
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

    return params;
}

function Slider(params) {
    nxw.NexusWidget.call(this, 'slider', prepareParams(params));
}

inherits(Slider, nxw.NexusWidget);

function create(params) {
    var w = new Slider(params);
    w.bindToValue();
    if(!params.relative) w.nx_widget.mode = "absolute";
    if(params.horizontal) w.nx_widget.hslider = true;
    w.nx_widget.init();
    return w;
}

module.exports.create = create;
