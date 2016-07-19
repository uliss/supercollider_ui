var options = {verbose: 1};

function postmsg(msg, prefix = '[NodeJS]: ') {
    console.log(prefix  +  msg);
}

function postln(msg) {
    if(options['verbose'] != 0) {
        postmsg(msg);
    }
}

function sc_path(path) {
    return "/sc" + path;
}

function node_path(path) {
    return "/node" + path;
}

function cli_path(path) {
    return "/cli" +  path;
}

module.exports.postmsg = postmsg;
module.exports.postln = postln;
module.exports.sc_path = sc_path;
module.exports.node_path = node_path;
module.exports.cli_path = cli_path;
