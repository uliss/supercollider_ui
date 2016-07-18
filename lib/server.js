function getHttp(res, path) {
    res.sendFile(path, {root: __dirname + '/../build/'});
}

function getModule(res, path) {
    getHttp(res, path + '.html');
}

function registerHttpCallbacks(app) {
    // root
    app.get('/', function(req, res){
        getModule(res, 'index');
    });

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

    app.get('/speakers', function(req, res) {
        getModule(res, 'speakers');
    });

    app.get('/info', function(req, res) {
        getModule(res, 'info');
    });

    app.get('/vlabel', function(req, res) {
        getModule(res, 'vlabel');
    });

    app.get('/vmetro', function(req, res) {
        getModule(res, 'vmetro');
    });

    app.get('/concert', function(req, res) {
        getModule(res, 'concert');
    });

    app.get('/ui', function(req, res) {
        getModule(res, 'ui');
    });

    app.get('/timer', function(req, res) {
        getModule(res, 'timer');
    });
}

module.exports.registerHttpCallbacks = registerHttpCallbacks;
