var inherits = require('inherits');
var nxw = require('./nexuswidget.js');

function Slider(params) {
    nxw.NexusWidget.call(this, 'slider', params);

    if (!this.params.relative)
        this.nx_widget.mode = "absolute";

    if (this.params.horizontal) {
        this.nx_widget.hslider = true;
    }
    else { // offset for vertical slider
        this.nx_widget.labelSize = 25;
        this.nx_widget.labelOffsetY = 30 - this.params.h;
    }

    this.nx_widget.draw();
}

inherits(Slider, nxw.NexusWidget);

Slider.prototype.prepareParams = function(params) {
    params = nxw.NexusWidget.prototype.prepareParams.call(this, params);

    if (!params.size) {
        params.w = 40;
        params.h = 200;
    } else {
        params.w = 40;
        params.h = params.size;
    }

    if (params.horizontal) {
        tmp = params.w;
        params.w = params.h;
        params.h = tmp;
    }

    var defaults = {
        'value': 0,
        'min': 0,
        'max': 1
    };

    return $.extend({}, defaults, params);
};

function create(params) {
    var w = new Slider(params);
    w.bindToValue();
    w.nx_widget.init();
    return w;
}

module.exports.create = create;
module.exports.Slider = Slider;
