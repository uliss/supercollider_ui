var widgets = require('../widgets');
var sl = require('../widgets/slider.js');
var server = require('../server.js');

var done = false;
var slider;

function create_ui() {
    if (done) return;
    done = true;

    server.on('/cli/widget/add', function(msg) {
        if(!msg.idx) { console.log("ERROR: no widget id!"); return; }
        if(!msg.type) { console.log("ERROR: no widget type!"); return; }
        msg.id = msg.idx;

        var w = widgets.create(msg.idx, msg.type, msg);
        if(msg.collapse) {
            w.jQ().detach().appendTo($('#ui-elements-modal'));
        }
    });

    server.on('/cli/widget/remove', function(id) {
        if(!id) console.log("ERROR: no widget id!");
        widgets.remove(id);
    });

    server.on('/cli/widget/command', function(msg) {
        if(!msg.idx) { console.log("ERROR: no widget id!"); return; }
        widgets.command(msg.idx, msg);
    });

    // handle widget update
    server.on('/cli/widget/update', function(msg) {
        if(!msg.idx) { console.log("ERROR: no widget id!"); return; }
        widgets.update(msg.idx, msg);
    });
}

function main() {
    create_ui();
    $(".modal").on("shown.bs.modal",function(event) {
        event.stopPropagation();
        console.log("stop");
    });
}

module.exports.main = main;
