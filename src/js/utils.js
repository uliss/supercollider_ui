function random_int(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function cli_path(path) { return "/cli" + path; }
function node_path(path) { return "/node" + path; }
function sc_path(path) { return "/sc" + path; }

function add(a, b) { return a + b; }

function sum(list) { return list.reduce(add, 0);}

function average(list) { return sum(list) / list.length; }

function log(prefix, arg_list) {
    var args = Array.prototype.slice.call(arg_list, 0);
    console.log('[' + prefix + '] ' + args.join(' '));
}

// utils
module.exports.cli_path = cli_path;
module.exports.node_path = node_path;
module.exports.sc_path = sc_path;
module.exports.random_int = random_int;
module.exports.log = log;


// funcs
module.exports.add = add;
module.exports.sum = sum;
module.exports.average = average;
