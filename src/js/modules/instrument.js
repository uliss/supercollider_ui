var server = require('../server.js');
var OSC_PATH = "/utils/instr";

function Instrument(name)
{
    var el = $('div[data-module^=instrument][data-name="' + name + '"]').attr('title', name);
    el.text('');

    var btn = $('<button>')
    .addClass('btn')
    .addClass('btn-lg')
    .addClass('btn-default')
    .addClass('instrument')
    .append($('<span class="glyphicon glyphicon-volume-up"/>'))
    .append($('<span>' + name + '</span>'))
    .click(function() {
        btn.toggleClass('active');
        btn.toggleClass('btn-primary');
        btn.toggleClass('btn-default');
        if(btn.hasClass('active')) { server.send_to_sc(OSC_PATH, name, "play"); }
        else { server.send_to_sc(OSC_PATH, name, "release"); }
    });

    el.append(btn);
}

function init(name) {
    $(document).ready(function() { Instrument(name); });
}

module.exports = Instrument;
