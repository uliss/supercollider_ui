var inherits = require('inherits');
var nxw = require('./nexuswidget.js');

function prepareParams(params) {
    if(!params.size)
    params.w = 120;
    else
    params.w = params.size;

    params.h = params.w * 0.5;

    return params;
}

function NumberWidget(params) {
    nxw.NexusWidget.call(this, 'number', prepareParams(params));
    if(params.rate) this.rate = params.rate;
    if(params.step) this.step = params.step;
    if(params.digits) this.decimalPlaces = params.digits;
    this.nx_widget.draw();
}

inherits(NumberWidget, nxw.NexusWidget);

function create(params) {
    var w = new NumberWidget(params);
    w.bind('value', function(data) {
        // OSC: /node/ui [ID, value]
        w.send([w.id(), data.value]);
    });

    return w;
}

module.exports.create = create;
