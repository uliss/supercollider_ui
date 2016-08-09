var crossfade = require('./crossfade.js');
var nl = require('./nl.js');
var image = require('./image.js');
var button = require('./button.js');


var create_functions = {};
var all_widgets = {};

init();

function init() {
    create_functions.crossfade = crossfade;
    create_functions.nl = nl;
    create_functions.image = image;
    create_functions.button = button;
}

function log(msg) {
    var args = Array.prototype.slice.call(arguments, 0);
    console.log("[widgets.js] " + args.join(' '));
}

function create(id, type, params) {
    if(!id) {
        log("invalid widget id given");
        return null;
    }

    if(!type) {
        log("invalid widget type given");
        return null;
    }

    if(all_widgets[id]) {
        log("widget already exists:", id);
        return null;
    }

    // console.log(params);
    var widget = create_functions[type].create(params);
    all_widgets[id] = widget;
    // console.log(widget);
    widget.show();
}

function remove(id) {
    if(!id) {
        log("invalid widget id given");
        return;
    }

    if(all_widgets[id]) {
        log("removing widget:", id);
        all_widgets[id].destroy();
        return;
    }

    log("unknown widget with id:", id);
}

function command(id, params) {
    if(!id) {
        log("invalid widget id given");
        return;
    }

    if(all_widgets[id]) {
        log("command to widget:", id);
        all_widgets[id].command(params);
        return;
    }

    log("unknown widget with id:", id);
}


module.exports.create = create;
module.exports.remove = remove;
module.exports.command = command;
