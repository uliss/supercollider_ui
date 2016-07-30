var utils = require('./utils');
var postmsg = utils.postmsg;
var postln = utils.postln;
var node_path = utils.node_path;
var cli_path = utils.cli_path;
var sc_path = utils.sc_path;


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
    "/tone":         "tone",
    "/":             "index",
};

function init(app, oscServer, oscClient, io) {
    registerHttpCallbacks(app);
    bindOsc(oscServer, oscClient, io);
    process.env.PATH = process.env.PATH + ":/usr/local/bin";
}

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

    // serve images files
    app.get('/img/*.jpg', function(req, res){
        getHttp(res, req['path']);
    });

    app.get('/img/*.png', function(req, res){
        getHttp(res, req['path']);
    });
}

function bindOsc(oscServer, oscClient, io) {
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
        postmsg([
            "set",
            "get",
            "echo",
            "help",
            "css",
            "redirect",
            "reload",
            "title",
            "alert"].sort().map(function(v){return node_path("/" + v)}).join("\n    "), "    ");
    });

    oscServer.on(node_path("/echo"), function (msg, rinfo) {
        postmsg(msg[1]);
    });

    oscServer.on(node_path("/css"), function(msg, rinfo) {
        postln('global css: ' + msg[1] + '{' +  msg[2] + ':' + msg[3] + '}');
        io.emit(cli_path("/css"), [msg[1], msg[2], msg[3]]);
    });

    oscServer.on(node_path("/redirect"), function(msg, rinfo) {
        postln('redirect to: ' + msg[1]);
        io.emit(cli_path("/redirect"), msg[1]);
    });

    oscServer.on(node_path("/reload"), function(msg, rinfo) {
        postln('reloading page...');
        io.emit(cli_path("/reload"), msg[1]);
    });

    oscServer.on(node_path("/title"), function(msg, rinfo) {
        postln('setting title: ' + msg[1]);
        io.emit(cli_path("/title"), msg[1]);
    });

    oscServer.on(node_path("/alert"), function(msg, rinfo) {
        postln('alert message: *' + msg[2] + '* - ' + msg[3]);
        io.emit(cli_path("/alert"), {'type': msg[1], 'title': msg[2], 'text': msg[3]});
    });

    oscServer.on(node_path("/supercollider"), function(msg, rinfo) {
        postln('message from SuperCollider server: ' + JSON.stringify(msg.slice(1)));
        io.emit(cli_path("/supercollider"), msg.slice(1));
    });

    oscServer.on(node_path("/forward"), function(msg, rinfo) {
        postln('Forwarding messsage from SC to: ' + msg[1] + ' => ' + msg.slice(2));
        io.emit(msg[1], msg.slice(2));
    });
}

function bindSocket(io, socket, oscClient) {
    socket.on(node_path("/supercollider"), function(msg){
        postln('Message to SuperCollider server: ' + JSON.stringify(msg));
        if(msg.length == 1) { oscClient.send(sc_path("/control"), msg[0]); }
        if(msg.length == 2) { oscClient.send(sc_path("/control"), msg[0], msg[1]); }
    });

    socket.on("/forward", function(msg) {
        switch(msg.length) {
            case 0:
                postln("Invalid forward message format. Should be: DEST_PATH [ARGS]");
            break;
            case 1:
                postln('Forwarding messsage to: ' + msg[0]);
                oscClient.send(msg[0]);
            default: {
                postln('Forwarding messsage to: ' + msg[0] + ' => ' + msg.slice(1));
                oscClient.send(msg[0], msg.slice(1));
            }
        }
    });
}

module.exports.init = init;
module.exports.bindSocket = bindSocket;
