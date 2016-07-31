// var jQuery = require('jquery');
// var audio = require('./audio.js');
// var sc = require('./supercollider_ui.js');
// var fittext = require('fittext.js');
var menu = require('./menu.js');
var alerts = require('./alerts.js');

$(document).ready(function() {
    // var mySlider = $("input.slider").bootstrapSlider();
    // $('h1').css('color', 'red');
    menu.init();
    alerts.init();
});
