var inherits = require('inherits');
var nxw = require('./nexuswidget.js');

function prepareParams(params) {
    params = nxw.makeSquared(params, 100);
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
