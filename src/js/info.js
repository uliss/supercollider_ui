var socket = io();

function get_info() {
    $(".info .clients").text("...");
    socket.emit('get_info');
}

$(document).ready(function() {
    socket.on('info', function(msg){
        $(".info .clients").text(msg.clientsCount);
        $(".info .remote-address").text(msg.remoteAddress);
        if(msg.superCollider) {
            $("#sc_state_icon").attr("class", "glyphicon glyphicon-volume-up");
            // $("#sc_state_text").text("on");
        }
        else {
            $("#sc_state_icon").attr("class", "glyphicon glyphicon-volume-off");
            // $("#sc_state_text").text("off");
        }

    });

    socket.on("/sc/stat", function(obj){
        $("#running-servers").text(obj.runningServers.join());
        $("#peak-cpu").text(obj.peakCPU);
        $("#avg-cpu").text(obj.avgCPU);

        var ul = $('<ul/>');
        $("#midi-devices").html(ul);
        $.each(obj.midiDevices, function(i) {
            var li = $('<li/>').text(obj.midiDevices[i]);
            li.appendTo(ul);
        });
    });
});
