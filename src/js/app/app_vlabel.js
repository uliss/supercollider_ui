var fittext = require('fittext.js');
var server = require('../server.js');

function main() {
    $(document).ready(
        function(){
            server.on('/vlabel/set', function(msg){
                $("#label").html(msg);
                $("#label").fitText(0.5);
            });

            server.on('/vlabel/css', function(msg){
                $("#label").css(msg[0], msg[1]);
            });
            // init
            $("#label").fitText(0.5);
        }
    );
}

module.exports.main = main;
