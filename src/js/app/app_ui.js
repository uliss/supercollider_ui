var widgets = require('../widgets');
var server = require('../server.js');
var utils = require('../utils.js');
var cli_path = utils.cli_path;

var HIDDEN_TARGET = '#ui-elements-hidden';
var PATH_ADD = cli_path('/widget/add');
var PATH_UPDATE = cli_path('/widget/update');
var PATH_REMOVE = cli_path('/widget/remove');
var PATH_REMOVE_ALL = cli_path('/widget/removeAll');
var PATH_COMMAND = cli_path('/widget/command');

function bindOsc() {
    server.on(PATH_ADD, function(msg) {
        if (!msg.idx) {
            console.log("ERROR: no widget id!");
            return;
        }
        if (!msg.type) {
            console.log("ERROR: no widget type!");
            return;
        }

        msg.id = msg.idx;

        var w = widgets.create(msg.idx, msg.type, msg);

        if (w.hidden) {
            var target = $(HIDDEN_TARGET);
            if (target.length > 0) {
                w = w.jQ().detach().appendTo(target);
            }
        }
    });

    server.on(PATH_REMOVE, function(id) {
        if (!id) console.log("ERROR: no widget id!");
        widgets.remove(id);
    });

    server.on(PATH_REMOVE_ALL, function(id) {
        if (!id) console.log("ERROR: no widget id!");
        widgets.remove(id);
    });

    server.on(PATH_COMMAND, function(msg) {
        if (!msg.idx) {
            console.log("ERROR: no widget id!");
            return;
        }
        widgets.command(msg.idx, msg);
    });

    server.on(PATH_UPDATE, function(msg) {
        if (!msg.idx) {
            console.log("ERROR: no widget id!");
            return;
        }
        widgets.update(msg.idx, msg);
    });
}

function main() {
    bindOsc();
}

module.exports.main = main;
module.exports.bindOsc = bindOsc;
