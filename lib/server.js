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

module.exports.registerHttpCallbacks = registerHttpCallbacks;
