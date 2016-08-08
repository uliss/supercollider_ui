function log(msg) {
    var args = Array.prototype.slice.call(arguments, 0);
    console.log("[base.js] " + args.join(' '));
}

function ColorScheme(params) {
    var defaults = {
        "accent": "#ff5500",
        "accenthl": "#ff6f26",
        "border": "#e3e3e3",
        "borderhl": "#727272",
        "fill": "#eeeeee",
        "text": "#000000"
    };

    var new_params = $.extend({}, defaults, params);
    this.create(new_params);
}

ColorScheme.prototype.create = function(params) {
    this.accent = params.accent;
    this.accenthl = params.accenthl;
    this.border = params.border;
    this.borderhl = params.borderhl;
    this.fill = params.fill;
    this.text = params.text;
};

function BaseWidget(params) {
    this.init_params = params;
    if(!params.id) {
        log("no id specified");
        return;
    }

    var defaults = {
        "x": 0,
        "y": 0,
        "parent": "ui-elements",
        "oscPath": "/ui",
        "colors": {
            "accent": "#ff5500",
            "accenthl": "#ff6f26",
            "border": "#e3e3e3",
            "borderhl": "#727272",
            "fill": "#eeeeee",
        }
    };

    this.params = $.extend({}, defaults, params);
    this.colorScheme = new ColorScheme(params.colors);
}

BaseWidget.prototype.id = function() { return this.params.id; };
BaseWidget.prototype.parentId = function() { return this.params.parent; };
BaseWidget.prototype.oscPath = function() { return this.params.oscPath; };
BaseWidget.prototype.destroy = function() { log("method 'destroy' should be redefined in parent classes!"); };
BaseWidget.prototype.show = function() { log("method 'show' should be redefined in parent classes!"); };


module.exports.BaseWidget = BaseWidget;
module.exports.ColorScheme = ColorScheme;
