function cli_path(path) { return "/cli" + path; }
function node_path(path) { return "/node" + path; }
function sc_path(path) { return "/sc" + path; }

var debug = false;

function api_send_to_sc(socket, path) {
    var args = [sc_path(path)].concat(Array.prototype.slice.call(arguments, 2));
    if(debug) console.log(args);
    socket.emit("/forward", args);
}

function api_from_sc(socket, path, func) {
    socket.on(cli_path(path), func);
}

module.exports.send_to_sc = api_send_to_sc;
module.exports.from_sc = api_from_sc;
module.exports.cli_path = cli_path;
module.exports.node_path = node_path;
module.exports.sc_path = sc_path;
