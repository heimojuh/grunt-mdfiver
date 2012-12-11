var jsdom = require("jsdom").jsdom;
var EventEmitter = require("events").EventEmitter,
    md5 = require('MD5'),
    fs = require("fs");

function mdfiver() {
    this.head = "";

}

function createReplaceString(originalFileNameAndMd5) {
    var lastIndexOfPoint = originalFileNameAndMd5.filename.lastIndexOf(".");
    var start = originalFileNameAndMd5.filename.substring(0,lastIndexOfPoint);
    var end = originalFileNameAndMd5.filename.substring(lastIndexOfPoint
    );
    return start+"_"+originalFileNameAndMd5.md5+end;

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

/***
* Calculates MD5 from chosen file
*
* Returns {"filenamewithpath", "md5"}
*
* @method createMD5FromFile
* @param file file with path
**/
mdfiver.prototype.createMD5FromFile = function(file) {
    var data = fs.readFileSync(file, "utf8");
    return {filename: file, md5:  md5(data)};
};

mdfiver.prototype.fixHeadEntry = function(replaceEntity) {
    var newFileName = createReplaceString(replaceEntity);
    return this.head.innerHTML.replace(replaceEntity.filename, newFileName);
};

mdfiver.prototype.renameFile = function(originalFileNameAndMd5) {
    fs.renameSync(originalFileNameAndMd5.filename, createReplaceString(originalFileNameAndMd5));
};

module.exports = mdfiver;
