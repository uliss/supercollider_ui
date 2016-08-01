var api = require('./api.js');
var socket = null;

function nav_menu_log(msg) {
    console.log('[menu.js] ' + msg);
}

function nav_menu_init_mute() {
    var el = $("#nav_ui_mute");
    var el_icon = el.find(".glyphicon");

    var set_state = function(on) {
        if(on == 1) {
            el_icon.removeClass("glyphicon-volume-up");
            el_icon.addClass("glyphicon-volume-off");
            el_icon.addClass("text-danger");
        }
        else {
            el_icon.removeClass("text-danger");
            el_icon.removeClass("glyphicon-volume-off");
            el_icon.addClass("glyphicon-volume-up");
        }
    };

    api.bind("onmute", function(state){set_state(state);});
    el.click(function(){ api.sc_mute_toggle(set_state); });
}

function nav_menu_init_volume_slider() {
    var el = $('#nav_ui_volume_slider_input');
    var ignore_events = false;

    el.data("onchange", function(value) {
        if(ignore_events) return;
        el.slider('setValue', value, false, false);
    });

    el.slider({
        formatter: function(value) { return value + ' db'; }
    })
    .on('slideStart', function() {ignore_events = true;})
    .on('slideStop', function() {ignore_events = false;})
    .on('slide', function(event) {
        socket.emit('/node/supercollider', ['setVolume', event.value]);
    });
}

function nav_menu_init_record_button() {
    var el = $("#nav_ui_record");
    var el_title = $("#nav_ui_record .text");
    var el_icon = $("#nav_ui_record .glyphicon");

    var set_state = function(on) {
        if(on == 1) {
            el.data("state", 1);
            el_title.text("Stop Recording");
            el_icon.addClass("text-danger");
        }
        else {
            el.data("state", 0);
            el_title.text("Record");
            el_icon.removeClass("text-danger");
        }
    };

    el.data("state", 0).click(function() {
        if(el.data("state") == 1) {
            set_state(0);
            socket.emit('/node/supercollider', ['stopRecord']);
        }
        else {
            set_state(1);
            socket.emit('/node/supercollider', ['record']);
        }
    });
}

function nav_menu_init_boot_button() {
    var el = $("#nav_ui_boot");
    var el_title = $("#nav_ui_boot .text");
    var el_icon = $("#nav_ui_boot .glyphicon");

    var set_state = function(on) {
        if(on == 1) {
            el_title.text("Stop supercollider");
            el_icon.removeClass("glyphicon-off");
            el_icon.addClass("glyphicon-remove");
        }
        else {
            el_title.text("Boot supercollider");
            el_icon.removeClass("glyphicon-remove");
            el_icon.addClass("glyphicon-off");
        }
    };

    el.click(function() { api.sc_toggle(set_state); });

    api.bind("onboot", function(){set_state(1);});
    api.bind("onquit", function(){set_state(0);});
    api.sc_state_request(set_state);
}

function nav_menu_init(io_socket) {
    socket = io_socket;
    nav_menu_init_mute();
    nav_menu_init_volume_slider();
    nav_menu_init_record_button();
    nav_menu_init_boot_button();
    nav_menu_handle();
}

function nav_menu_handle() {
    // socket.on('/cli/supercollider', function(msg) {
    //     var func;
    //     switch(msg[0]) {
    //         case 'boot': {
    //             func = $("#nav_ui_boot").data("onboot");
    //             func();
    //         }
    //         break;
    //         case 'quit': {
    //             func = $("#nav_ui_boot").data("onquit");
    //             func();
    //         }
    //         break;
    //         case 'volume': {
    //             func = $("#nav_ui_volume_slider_input").data("onchange");
    //             func(msg[1]);
    //         }
    //         break;
    //         case 'mute': {
    //             func = $("#nav_ui_mute").data("onchange");
    //             func(msg[1]);
    //         }
    //         break;
    //         default: {
    //             console.log('[/cli/supercollider] unknown message: ' + msg);
    //         }
    //     }
    //     nav_menu_log(msg);
    // });
}

module.exports.init = nav_menu_init;
