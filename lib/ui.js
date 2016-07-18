function httpGet(req, res) {
    res.sendFile('ui.html', {root: __dirname + '/../build/'});
}





module.exports.httpGet = httpGet;
