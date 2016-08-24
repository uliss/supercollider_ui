var widgets = require('../widgets');
var server = require('../server.js');

function bindOsc() {
    server.on('/cli/widget/add', function(msg) {
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
            var target = $('#ui-elements-hidden');
            if (target.length > 0) {
                w = w.jQ().detach().appendTo(target);
            }
        }
    });

    server.on('/cli/widget/remove', function(id) {
        if (!id) console.log("ERROR: no widget id!");
        widgets.remove(id);
    });

    server.on('/cli/widget/command', function(msg) {
        if (!msg.idx) {
            console.log("ERROR: no widget id!");
            return;
        }
        widgets.command(msg.idx, msg);
    });

    // handle widget update
    server.on('/cli/widget/update', function(msg) {
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
