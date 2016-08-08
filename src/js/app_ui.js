var widgets = require('./widgets');
var server = require('./server.js');

function main() {
    server.socket.on('/cli/widget/add', function(msg) {
        if(!msg.idx) console.log("ERROR: no widget id!");
        if(!msg.type) console.log("ERROR: no widget type!");
        msg.id = msg.idx;

        widgets.create(msg.idx, msg.type, msg);
    });

    server.socket.on('/cli/widget/remove', function(id) {
        if(!id) console.log("ERROR: no widget id!");
        widgets.remove(id);
    });
}

module.exports.main = main;
