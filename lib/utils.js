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

function set_opt(key, value) {
    options[key] = value;
}

function get_opt(key) {
    return options[key];
}

module.exports.postmsg = postmsg;
module.exports.postln = postln;
module.exports.sc_path = sc_path;
module.exports.node_path = node_path;
module.exports.cli_path = cli_path;
module.exports.set_opt = set_opt;
module.exports.get_opt = get_opt;
