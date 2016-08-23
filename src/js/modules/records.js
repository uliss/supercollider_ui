var aplayer = require('APlayer');
var server = require('../server.js');
var utils = require('../utils.js');
var node_path = utils.node_path;
var cli_path = utils.cli_path;


function promise_records_get() {
    return new Promise(function(resolve, reject) {
        server.send(node_path("/records/playlist"));
        server.on(cli_path("/records/playlist"), function(msg) {
            resolve(msg);
        });

        setTimeout(function() {
            reject(new Error("records timeout"));
        }, 3000);
    });
}

function fill_records(callback) {
    promise_records_get()
        .then(
            function(records_list) {
                callback(records_list);
            },
            function(error) {
                console.log("[records.js] " + error.message);
            }
        );
}


function Records() {
    var id = 'unit-records';
    var el = $('div[data-module^=records]').attr('id', id);

    if (el.length < 1) return;

    el.append($("<h2>Records</h2>"));
    var cont = $('<div>').attr('id', 'unit-recordplayer').addClass('aplayer');
    el.append(cont);

    var option = {
        element: document.getElementById('unit-recordplayer'), // Optional, player element
        // narrow: false, // Optional, narrow style
        // autoplay: true, // Optional, autoplay song(s), not supported by mobile browsers
        showlrc: 0, // Optional, show lrc, can be 0, 1, 2, see: ###With lrc
        mutex: true, // Optional, pause other players when this player playing
        theme: "#337ab7",
        loop: false, // Optional, loop play music, default: true
        preload: 'metadata', // Optional, the way to load music, can be 'none' 'metadata' 'auto', default: 'metadata' in Desktop, 'none' in mobile
    };

    fill_records(function(playlist) {
        option.music = playlist;
        var ap = new aplayer.APlayer(option);
        ap.init();
    });
}

function init(name) {
    $(document).ready(function() {
        Records();
    });
}

module.exports = init;
