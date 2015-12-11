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
        $("#running-servers").text(obj.runningServers.join());
        $("#peak-cpu").text(obj.peakCPU);
        $("#avg-cpu").text(obj.avgCPU);

        if(obj.runningServers.length > 0) {
            $("#sc_state_icon").attr("class", "glyphicon glyphicon-volume-up");
        }
        else {
            $("#sc_state_icon").attr("class", "glyphicon glyphicon-volume-off");
            $("#peak-cpu").text("...");
            $("#avg-cpu").text("...");
        }

        var ul = $('<ul/>');
        $("#midi-devices").html(ul);
        $.each(obj.midiDevices, function(i) {
            var li = $('<li/>').text(obj.midiDevices[i]);
            li.appendTo(ul);
        });
    });
});
