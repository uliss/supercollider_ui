$(document).ready(function() {
    socket.emit("/concert/info/get", "get");

    socket.on("/concert/info", function(msg){
        $("h2").text(msg.date + " / " + msg.place);
        $("#pieces").html("<ol/>");
        // var json = JSON.parse(msg);
        // console.log(json);
    });

    socket.on("/concert/add", function(msg){
        console.log(msg);
        $("#pieces ol").append("<li><span class=composer>" + msg.composer + "</span> / " +
        "<span class=title>" + msg.title + "</span> <div><button class=\"btn btn-primary\" id=" + msg.id + ">Start</button></div>" +  "</li>");
    });

    $(document).on('click', 'button', function () {
        var path = "/concert/control";
        var msg;
        if(this.textContent == "Start") {
            this.textContent = "Stop";
            msg = "start";
        }
        else {
            this.textContent = "Start";
            msg = "pause";
        }

        socket.emit(path, [this.id, msg]);
    });
});
