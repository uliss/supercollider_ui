var socket = io();

function get_info() {
    $(".info .clients").text("...");
    socket.emit('get_info');
}

$(document).ready(function() {
    socket.on('info', function(msg){
        $(".info .clients").text(msg.clientsCount);
        $(".info .remote-address").text(msg.remoteAddress);
    });

    socket.on("/sc/stat", function(obj){
        var opts = obj.serverOptions;

        $("#running-servers").text(obj.runningServers.join());
        $("#peak-cpu").text((obj.peakCPU).toFixed(2));
        $("#avg-cpu").text((obj.avgCPU).toFixed(2));
        $("#sample-rate").text(opts.sampleRate);

        if(obj.runningServers.length > 0) {
            $("#state-icon").attr("class", "glyphicon glyphicon-volume-up");
        }
        else {
            $("#state-icon").attr("class", "glyphicon glyphicon-volume-off");
            $("#peak-cpu").text("...");
            $("#avg-cpu").text("...");
        }

        var ul = $('<ul/>');
        $("#midi-devices").html(ul);
        $.each(obj.midiDevices, function(i) {
            var li = $('<li/>').text(obj.midiDevices[i]);
            li.appendTo(ul);
        });

        var audio_ul = $('<ul/>');
        $("#audio-devices").html(audio_ul);
        $.each(obj.audioDevices, function(i) {
            var li = $('<li/>').text(obj.audioDevices[i]);
            li.appendTo(audio_ul);
        });
    });
});
