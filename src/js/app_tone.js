var server = require('./server.js');
var audio = require('./audio.js');
var latency = require('./latency.js');

var oscil = new audio.AudioToneGenerator();
var global_freq = 442;
var OSCIL_PATH = "/utils/osc";

function tone_run_oscil() {
    $(document).on('change', 'input:radio[id^="frequency_"]', function (event) {
        global_freq = parseFloat($(this).prop('value'));
        oscil.setFreq(global_freq);
        server.send_to_sc(OSCIL_PATH, "set", "freq", global_freq);
    });

    // button play local
    $("#playLocal").click(function() {
        var $this = $(this);
        $this.toggleClass('btn-default');
        if(oscil.isPlaying()) {
            oscil.stop();
            $this.removeClass("btn-success");
        }
        else {
            oscil.play();
            $this.addClass("btn-success");
        }
    });

    // button play server
    $("#playServer").click(function() {
        var $this = $(this);
        $this.toggleClass('btn-primary');
        if($this.hasClass('btn-primary')) {
            server.send_to_sc(OSCIL_PATH, "play", global_freq);
        }
        else {
            alerts_handle.send_to_sc(OSCIL_PATH, "stop");
        }
    });
}

function tone_run_latency() {
    // button
    $("#getLatency").click(function() {
        latency.measure_latency_avg(function(ms) {
            $("#latencyLabel").text(ms + ' ms');
        }, 5);
    });
}

function init() {
    $(document).ready(function() {
        tone_run_oscil();
        tone_run_latency();
    });
}

module.exports.init = init;
