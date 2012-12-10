var jsdom = require("jsdom").jsdom;
var EventEmitter = require("events").EventEmitter;

function mdfiver() {
    this.head = "";

}

mdfiver.prototype = Object.create(EventEmitter.prototype);

mdfiver.prototype.parseHead = function(html) {
    this.head = jsdom( 
    html,
    null
    ).createWindow().document.getElementsByTagName("head")[0];
};

mdfiver.prototype.getScriptTags = function() {
    return this.head.getElementsByTagName("script");
};

mdfiver.prototype.getCSSTags = function() {
    return this.head.getElementsByTagName("link");
};

module.exports = mdfiver;
