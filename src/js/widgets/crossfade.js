var base = require('./base.js');

function create(params) {
    if(!params.size)
    params.w = 200;
    else
    params.w = params.size;

    params.h = params.w * 0.15;

    var widget = ui_make_widget("crossfade", params);
    widget.setFont(10);
    widget.on('*', function(data) {
        sendUI2Node(params.oscPath, [widget.canvasID, data.value]);
    });
    return widget;
}

module.exports.create = create;
