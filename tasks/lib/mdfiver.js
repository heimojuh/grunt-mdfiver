var jsdom = require("jsdom").jsdom;

function mdfiver() {
    this.head = "";

}

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
