var server = require('../server.js');
var w = require('../widgets');
var OSC_PATH = "/utils/instr";

var instrument_cnt = 0;
function make_instrument_id() {
    instrument_cnt += 1;
    return 'instr_' + instrument_cnt;
}

function make_instrument_cont_id() {
    instrument_cnt += 1;
    return 'instr_cont_' + instrument_cnt;
}

function Instrument(name)
{
    var el = $('div[data-module^=instrument][data-name="' + name + '"]').attr('title', name);
    // el.text('');

    var btn = $('<button>')
    .addClass('btn')
    .addClass('btn-lg')
    .addClass('btn-default')
    .append($('<span class="glyphicon glyphicon-volume-up"/>'))
    .append($('<span>' + name + '</span>'))
    .click(function() {
        btn.toggleClass('active');
        btn.toggleClass('btn-primary');
        btn.toggleClass('btn-default');
        if(btn.hasClass('active')) { server.send_to_sc(OSC_PATH, name, "play", "amp", widget.value()); }
        else { server.send_to_sc(OSC_PATH, name, "release"); }
    });

    el.append(btn);

    var parent_id = make_instrument_cont_id();
    var amp_slider = $('<span>').attr('id', parent_id).addClass('slider');
    el.append(amp_slider);

    var el_id = make_instrument_id();
    var widget = w.create(el_id, 'slider', {'oscPath': '/ui', 'size': 200, 'value': 0.0, 'min': 0.0, 'max': 1.0, 'id': el_id, 'parent': parent_id, 'horizontal': true});
    widget.nx_widget.removeAllListeners('value');
    widget.bindTo('value', function(amp){
        server.send_to_sc(OSC_PATH, name, "set", "amp", amp);
    });
    widget.setValue(0.1);
}

function init(name) {
    $(document).ready(function() { Instrument(name); });
}

module.exports = Instrument;
