var winston = require("winston");
var winston_config = require('winston/lib/winston/config');

var options = {
    verbose: 1
};

function postmsg(msg, prefix = '[NodeJS]: ') {
    console.log(prefix + msg);
}

function postln(msg) {
    if (options['verbose'] != 0) {
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
    return "/cli" + path;
}

function set_opt(key, value) {
    options[key] = value;
}

function get_opt(key) {
    return options[key];
}

var logger = new winston.Logger({

    transports: [
        new winston.transports.Console({
            level: "debug",
            handleExceptions: true,
            json: false,
            colorize: true,
            prettyPrint: true,
            label: "NodeUI",
            // handleExceptions: true,
            // humanReadableUnhandledException: true,
            formatter: function(options) {
                var output =  '[' + options.label + ':';
                output += winston_config.colorize(options.level, options.level) + '] ';
                output += (undefined !== options.message ? options.message : '') +
                (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
                return output;
            }
        })
    ]
});

module.exports.postmsg = postmsg;
module.exports.postln = postln;
module.exports.sc_path = sc_path;
module.exports.node_path = node_path;
module.exports.cli_path = cli_path;
module.exports.set_opt = set_opt;
module.exports.get_opt = get_opt;
module.exports.log = logger;
