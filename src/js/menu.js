function menu_create_sound_menu(parent) {
    var drop_down = $('<div class="dropdown pull-right dropdown-menu-right text-primary ui_main_dropdown">')
    .appendTo(parent);

    var button = $('<button id="sc_control_menu" class="btn btn-default dropdown-toggle glyphicon glyphicon-cog"><span class="caret"/></button>')
    .attr("data-toggle", "dropdown")
    .attr("aria-haspopup", "true")
    .attr("aria-expanded", "false")
    .appendTo(drop_down);

    function toggle_sound_state(state) {
        button.removeClass("glyphicon-cog");
        if(state == 1) {
            button.removeClass("glyphicon-volume-off");
            button.addClass("glyphicon-volume-up");
            socket.emit('/node/supercollider', ['boot']);
        }
        else {
            button.removeClass("glyphicon-volume-up");
            button.addClass("glyphicon-volume-off");
            socket.emit('/node/supercollider', ['quit']);
        }
    }

    var link1 = $('<li><a href="#" id="sc_control_menu_boot"><span class="glyphicon glyphicon-off"/><span class="text">On</span></a></li>')
    .data("state", 0)
    .click(function(e) {
        if(link1.data("state") != 1) {
            link1.data("state", 1);
            link1.find(".text").text("Off");
            toggle_sound_state(1);
        }
        else {
            link1.data("state", 0);
            link1.find(".text").text("On");
            toggle_sound_state(0);
        }
    });

    var link2 = $('<li><a href="#" id="sc_control_menu_record"><span class="glyphicon glyphicon-record"/><span class="text">Record<span></a></li>')
    .data("state", 0)
    .click(function(e){
        if(link2.data("state") != 1) {
            console.log("SuperCollider record");
            link2.data("state", 1);
            link2.find(".text").text("Stop recording");
            socket.emit('/node/supercollider', 'record');
        }
        else {
            console.log("SuperCollider stop record");
            link2.data("state", 0);
            link2.find(".text").text("Record");
            socket.emit('/node/supercollider', 'recordStop');
        }
    });

    var link3 = $('<li><a href="#" id="sc_control_menu_volume">Volume: </a></li>');

    var menu_actions = $('<ul class="dropdown-menu"/>')
    .append(link1)
    .append(link2)
    .append(link3)
    .appendTo(drop_down);

    var change_volume = function() {
        var value = vol_slider.slider('getValue');
        $("#sc_control_menu_volume").find(".display").text(value + " db");
        socket.emit('/node/supercollider', ['setVolume', value]);
    };

    var vol_slider = $('<input id="ex1" data-slider-id="ex1Slider" type="text" data-slider-min="-60" data-slider-max="0" data-slider-step="1" data-slider-value="0" data-slider-tooltip="always"/>')
    .on('slide', change_volume)
    .appendTo($("#sc_control_menu_volume"));

    // $('<span class="display">0 db</span>').appendTo($("#sc_control_menu_volume"));

    vol_slider.slider({
        formatter: function(value) { return value + ' db'; }
    });
}

function menu_create_main_menu() {
    var drop_down = $('<div class="dropdown pull-right dropdown-menu-right text-primary ui_main_dropdown">');

    var button = $('<button class="btn btn-default dropdown-toggle glyphicon glyphicon-menu-hamburger"><span class="caret"/></button>')
    .attr("data-toggle", "dropdown")
    .attr("aria-haspopup", "true")
    .attr("aria-expanded", "false")
    .appendTo(drop_down);

    var link1 = $('<li><a href="/"><span class="glyphicon glyphicon-home"></span> Home</a></li>');
    var link2 = $('<li><a href="/timer"><span class="glyphicon glyphicon-time"></span> Timer</a></li>');
    var link3 = $('<li><a href="/vlabel"><span class="glyphicon glyphicon-tags"></span> Label</a></li>');
    var link4 = $('<li><a href="/vmetro"><span class="glyphicon glyphicon-hourglass"></span> Metronome</a></li>');
    var link5 = $('<li><a href="/ui"><span class="glyphicon glyphicon-th"></span> UI</a></li>');

    var actions = $('<ul class="dropdown-menu"/>')
    .append(link1)
    .append(link2)
    .append(link3)
    .append(link4)
    .append(link5)
    .appendTo(drop_down);

    return drop_down;
}
