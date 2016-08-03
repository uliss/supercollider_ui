var server = require('./server.js');
var audio = require('./audio.js');

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
            server.send_to_sc(OSCIL_PATH, "stop");
        }
    });
}

function main() {
    $(document).ready(function() {
        tone_run_oscil();
    });
}

module.exports.main = main;
