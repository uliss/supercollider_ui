var server = require('../server.js');
var w = require('../widgets');
var _ = require('underscore');
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

/**
 * Parses elements parameters from attribute *data-param*
 * @param jquery element
 * @return list of params: ["param1", 1.0, "param2", 0.2] for "param1=1.0,param2=0.2"
 */
function parse_instrument_params(jq_el) {
    var res = [];
    var data = jq_el.attr('data-param');
    if (!data) return res;

    _.each(data.split(','), function(i) {
        var pair = i.trim().split('=');
        res.push(pair[0].trim());
        res.push(parseFloat(pair[1].trim()));
    });

    return res;
}

function Instrument(name) {
    var el = $('div[data-module^=instrument][data-name="' + name + '"]').attr('title', name);

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
            if (btn.hasClass('active')) {
                var params = parse_instrument_params(el);
                if (params.length > 0) {
                    var args = [OSC_PATH, name, "init"].concat(params);
                    server.send_to_sc.apply(this, args);
                }

                server.send_to_sc(OSC_PATH, name, "play", "amp", widget.value());
            } else {
                server.send_to_sc(OSC_PATH, name, "release");
            }
        });

    el.append(btn);

    var parent_id = make_instrument_cont_id();
    var amp_slider = $('<span>').attr('id', parent_id).addClass('slider');
    el.append(amp_slider);

    var el_id = make_instrument_id();
    var widget = w.create(el_id, 'slider', {
        'oscPath': '/ui',
        'size': 200,
        'value': 0.0,
        'min': 0.0,
        'max': 1.0,
        'id': el_id,
        'parent': parent_id,
        'horizontal': true
    });
    widget.nx_widget.removeAllListeners('value');
    widget.bindTo('value', function(amp) {
        server.send_to_sc(OSC_PATH, name, "set", "amp", amp);
    });
    widget.setValue(0.1);
}

function init(name) {
    $(document).ready(function() {
        Instrument(name);
    });
}

module.exports = Instrument;
