var jsdom = require("jsdom").jsdom;
    md5 = require('MD5'),
    fs = require("fs"),
    _ = require("underscore");


function mdfiver(htmlfile) {
    this.head = "";
    this.htmlfile = htmlfile;
    if (this.htmlfile) {
        this.html = fs.readFileSync(htmlfile);
    }

}

function createReplaceString(originalFileNameAndMd5) {
    var lastIndexOfPoint = originalFileNameAndMd5.filename.lastIndexOf(".");
    var start = originalFileNameAndMd5.filename.substring(0,lastIndexOfPoint);
    var end = originalFileNameAndMd5.filename.substring(lastIndexOfPoint
    );
    return start+"_"+originalFileNameAndMd5.md5+end;

}

mdfiver.prototype.parseHead = function() {
    this.head = jsdom( 
        this.html,
        null
    ).createWindow().document.getElementsByTagName("head")[0];
};

mdfiver.prototype.getScriptTagsPaths = function() {
    var paths = [];
    _.each(this.head.getElementsByTagName("script"), function(element) {
        paths.push(element.getAttribute("src"));
    });
    return paths;
};

mdfiver.prototype.getCSSTagsPaths = function() {
    var paths = [];
    _.each(this.head.getElementsByTagName("link"), function(element) {
        paths.push(element.getAttribute("href"));
    });
    return paths;
};

/***
* Calculates MD5 from chosen file
*
* Returns {filename: "filenamewithpath", md5: "md5"}
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
