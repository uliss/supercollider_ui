var io = require('socket.io-client');
var socket = io();

function alerts_handle() {
    socket.on('/cli/alert', function(msg){
        var show_error = function(msg) {
            $('#ui_modal_error_title').text(msg.title);
            $('#ui_modal_error_text').text(msg.text);
            $('#ui_modal_error').modal({});
        };

        var show_ok = function(msg) {
            $('#ui_modal_ok_title').text(msg.title);
            $('#ui_modal_ok_text').text(msg.text);
            $('#ui_modal_ok').modal({});
        };

        var show_info = function(msg) {
            $('#ui_modal_info_title').text(msg.title);
            $('#ui_modal_info_text').text(msg.text);
            $('#ui_modal_info').modal({});
        };

        switch(msg.type) {
            case 'error': show_error(msg); break;
            case 'ok':    show_ok(msg); break;
            case 'info':  show_info(msg); break;
            default: { console.log('unknown alert type: ' + msg.type); }
        }
    });
}

module.exports.init = alerts_handle;
