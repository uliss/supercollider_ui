const gm = require('gm');
const path = require('path');
const fs = require('fs');
const utils = require('./utils');

const appDir = path.dirname(require.main.filename);
var postmsg = utils.postmsg;
var postln = utils.postln;
var node_path = utils.node_path;
var sc_path = utils.sc_path;

function uploadImage(src, dest, size, oscClient) {
    var img = gm(src);
    // img.resize(1000, 1000);
    img.write(dest, function(err) {
        if(err) {
            postln("GraphicsMagick error" + err);
        } {
            var url = path.join("/img", path.basename(src));
            oscClient.send(sc_path("/image/upload/url"), url);

            img.size(function(err, value){
                if(!err) {
                    postmsg(value);
                    oscClient.send(sc_path("/image/upload/size"), value.width, value.height);
                }
            })
        }
    });
}

function bindOsc(oscServer, oscClient) {
    oscServer.on(node_path("/image/upload"), function (msg, rinfo) {
        var src_path = msg[1];
        var params = {};
        if(msg[2]) { params = JSON.parse(msg[2]); }

        postmsg("Upload image: '" + src_path + "'");
        // check source image exists
        fs.access(msg[1], fs.F_OK, function(err) {
            if (!err) {
                var target_dir = path.join(appDir, 'build/img');
                // check target directory exists
                fs.access(target_dir, fs.F_OK, function(err) {
                    if(err) { // make target directory
                        fs.mkdirSync(target_dir);
                    }

                    var target_path = path.join(target_dir, path.basename(src_path));
                    // check image exists
                    fs.access(target_path, fs.F_OK, function(err) {
                        // not exists
                        if(!err) {
                            postln("image already exists: " + target_path);
                            postln("removing: " + target_path);
                            fs.unlinkSync(target_path);
                        }

                        uploadImage(src_path, target_path, {}, oscClient);
                    });
                });
            }
            else {
                console.log("[NodeJS/images] no such file: " + src_path)
            }
        });
    });
}

module.exports.init = bindOsc;
