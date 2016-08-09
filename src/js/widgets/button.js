var inherits = require('inherits');
var nxw = require('./nexuswidget.js');

function prepareParams(params) {
    if(!params.size)
    params.w = params.h = 100;
    else
    params.w = params.h = params.size;

    params.mode = "single";
    return params;
}

function Button(params) {
    nxw.NexusWidget.call(this, 'button', prepareParams(params));
}

inherits(Button, nxw.NexusWidget);

function create(params) {
    var w = new Button(params);

    w.bind('press', function(data) {
        // OSC: /node/ui [buttonId, (1|0)] 
        w.send([w.id(), data]);
    });

    return w;
}

module.exports.create = create;
