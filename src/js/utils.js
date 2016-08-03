function random_int(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


function cli_path(path) { return "/cli" + path; }
function node_path(path) { return "/node" + path; }
function sc_path(path) { return "/sc" + path; }

// utils
module.exports.cli_path = cli_path;
module.exports.node_path = node_path;
module.exports.sc_path = sc_path;
module.exports.random_int = random_int;
