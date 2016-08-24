var inherits = require('inherits');
var knob = require('./knob.js');

function prepareParams(params) {
    if (!params.size)
        params.w = 60;
    else
        params.w = params.size;

    params.min = -1.0;
    params.max = 1.0;
    params.colors = {
        // accent: "#f1c40f",
        // fill: "#e67e22",
        accent: "#19B5FE",
        // accent: "#e67e22",
        borderhl: "#FFF"
    };

    return params;
}

function Pan(params) {
    knob.Knob.call(this, params);
    this.nx_widget.widgetStyle = 'handle';
    this.nx_widget.angleGap = 0.25;
    this.nx_widget.responsivity = 0.009;

    var $this = this;

    this.nx_widget.canvas.ondblclick = function(event) {
        $this.reset();
    };

    $(this.nx_widget.canvas).on('doubleTap', function() {
        $this.reset();
    });

    this.nx_widget.init();
}

inherits(Pan, knob.Knob);

Pan.prototype.reset = function() {
    this.nx_widget.set({
        'value': 0
    }, true);
    this.nx_widget.init();
};

function create(params) {
    params = prepareParams(params);
    var w = new Pan(params);
    w.bindToValue();
    return w;
}

module.exports.create = create;
