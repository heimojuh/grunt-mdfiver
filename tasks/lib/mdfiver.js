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

module.exports = mdfiver;
