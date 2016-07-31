var debug = false;

function api_forward(socket, path) {
    var args = Array.prototype.slice.call(arguments, 1);
    if(debug) console.log(args);
    socket.emit("/forward", args);
}

module.exports.forward = api_forward;
