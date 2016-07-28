function nav_menu_init_mute() {
    var el = $("#nav_ui_mute");
    var el_icon = el.find(".glyphicon");

    var set_state = function(on) {
        if(on == 1) {
            el.data("state", 1);
            el_icon.removeClass("glyphicon-volume-up");
            el_icon.addClass("glyphicon-volume-off");
            el_icon.addClass("text-danger");
        }
        else {
            el.data("state", 0);
            el_icon.removeClass("text-danger");
            el_icon.removeClass("glyphicon-volume-off");
            el_icon.addClass("glyphicon-volume-up");
        }
    };

    el.data("state", 0)
    .click(function(){
        if(el.data("state") == 1) {
            set_state(0);
            socket.emit('/node/supercollider', ['mute', 0]);
        }
        else {
            set_state(1);
            socket.emit('/node/supercollider', ['mute', 1]);
        }
    });
}

function nav_menu_init_volume_slider() {
    var el = $('#nav_ui_volume_slider_input');

    el.slider({
        formatter: function(value) { return value + ' db'; }
    })
    .on('slide', function() {
        var value = el.slider('getValue');
        socket.emit('/node/supercollider', ['setVolume', value]);
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
            el.data("state", 1);
            el_title.text("Stop supercollider");
            el_icon.addClass("text-success");
        }
        else {
            el.data("state", 0);
            el_title.text("Boot supercollider");
            el_icon.removeClass("text-success");
        }
    };

    el.data("state", 0)
    .click(function() {
        if(el.data("state") == 1) {
            set_state(0);
            socket.emit('/node/supercollider', ['quit']);
        }
        else {
            set_state(1);
            socket.emit('/node/supercollider', ['boot']);
        }
    });
}

function nav_menu_init() {
    nav_menu_init_mute();
    nav_menu_init_volume_slider();
    nav_menu_init_record_button();
    nav_menu_init_boot_button();
}
