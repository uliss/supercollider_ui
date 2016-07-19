var utils = require('./utils');
var postmsg = utils.postmsg;
var postln = utils.postln;
var node_path = utils.node_path;

function getHttp(res, path) {
    res.sendFile(path, {root: __dirname + '/../build/'});
}

function getModule(res, path) {
    getHttp(res, path + '.html');
}

function registerModule(app, url, path) {
    app.get(url, function(req, res) {
        getModule(res, path);
    });
}

var path_map = {
    "/speakers":     "speakers",
    "/info":         "info",
    "/vlabel":       "vlabel",
    "/vmetro":       "vmetro",
    "/concert":      "concert",
    "/ui":           "ui",
    "/timer":        "timer",
    "/":             "index",
};

function registerHttpCallbacks(app) {
    for(k in path_map) {
        registerModule(app, k, path_map[k]);
    }

    // serve CSS files
    app.get('/css/*.css', function(req, res){
        getHttp(res, req['path']);
    });

    app.get('/css/*', function(req, res){
        getHttp(res, req['path']);
    });

    // serve JS lib files
    app.get('/js/*', function(req, res){
        getHttp(res, req['path']);
    });
}

function bindOsc(oscServer, oscClient) {
    oscServer.on(node_path("/set"), function (msg, rinfo) {
        var k = msg[1];

        if(k == "help") {
            postmsg(msg[0] + ' KEY VALUE');
            postmsg('- sets server variable', '    ');
            return;
        }

        utils.set_opt(k, msg[2]);
        postmsg('SET ' + k + ' = ' + msg[2]);
    });

    oscServer.on(node_path("/get"), function (msg, rinfo) {
        var k = msg[1];
        var v = utils.get_opt(k);

        if(k == "help") {
            postmsg(msg[0] + ' KEY');
            postmsg('- reads server variable and sends it back to osc://localhost' + sc_path('/server/get'), '    ');
            return;
        }

        oscClient.send(sc_path("/get"), k, v);
        postmsg('var ' + k + ' == ' + v);
    });

    oscServer.on(node_path("/help"), function (msg, rinfo) {
        postmsg("Available commands:");
        postmsg(["set", "get", "echo", "help"].map(function(v){return node_path("/" + v)}).join("\n    "), "    ");
    });

    oscServer.on(node_path("/echo"), function (msg, rinfo) {
        postmsg(msg[1]);
    });
}

module.exports.bindHttp = registerHttpCallbacks;
module.exports.bindOsc = bindOsc;
