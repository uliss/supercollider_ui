var api = require('./api.js');
var socket = null;

function nav_menu_log(msg) {
    console.log('[menu.js] ' + msg);
}

function nav_update(state) {
    nav_update_boot(state);
    nav_update_record(state);
    nav_update_mute(state);
    nav_update_volume(state);
}

function nav_update_mute(state) {
    var el_icon = $("#nav_ui_mute .glyphicon");

    if(state.mute) {
        el_icon.removeClass("glyphicon-volume-up");
        el_icon.addClass("glyphicon-volume-off");
        el_icon.addClass("text-danger");
    }
    else {
        el_icon.removeClass("text-danger");
        el_icon.removeClass("glyphicon-volume-off");
        el_icon.addClass("glyphicon-volume-up");
    }
}

function nav_menu_init_mute() {
    $("#nav_ui_mute").click(function(){ api.sc_mute_toggle(nav_update_mute); });
}

function nav_update_volume(state) {
    var el = $('#nav_ui_volume_slider_input');
    if(el.data("ignore")) return;

    el.slider('setValue', state.volume, false, false);
}

function nav_menu_init_volume_slider() {
    var el = $('#nav_ui_volume_slider_input');

    el.data('ignore', false)
    .slider({ formatter: function(value) { return value + ' db'; }})
    .on('slideStart', function() { el.data("ignore", true); })
    .on('slideStop', function() { el.data("ignore", false); })
    .on('slide', function(event) { api.sc_volume(event.value); });
}

function nav_update_record(state) {
    var el_title = $("#nav_ui_record .text");
    var el_icon = $("#nav_ui_record .glyphicon");

    if(state.record) {
        el_title.text("Stop Recording");
        el_icon.addClass("text-danger");
    }
    else {
        el_title.text("Record");
        el_icon.removeClass("text-danger");
    }
}

function nav_menu_init_record_button() {
    $("#nav_ui_record").click(function() { api.sc_record_toggle(nav_update_record); });
}

function nav_update_boot(state) {
    var el_title = $("#nav_ui_boot .text");
    var el_icon = $("#nav_ui_boot .glyphicon");

    if(state.boot) {
        el_title.text("Stop supercollider");
        el_icon.removeClass("glyphicon-off");
        el_icon.addClass("glyphicon-remove");
    }
    else {
        el_title.text("Boot supercollider");
        el_icon.removeClass("glyphicon-remove");
        el_icon.addClass("glyphicon-off");
    }
}

function nav_menu_init_boot_button() {
    $("#nav_ui_boot").click(function() { api.sc_boot_toggle(nav_update_boot); });
}

function nav_menu_init(io_socket) {
    socket = io_socket;
    api.subscribe(nav_update);
    nav_menu_init_mute();
    nav_menu_init_volume_slider();
    nav_menu_init_record_button();
    nav_menu_init_boot_button();

    api.sc_state_request();
}

module.exports.init = nav_menu_init;
