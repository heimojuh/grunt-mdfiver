var jsdom = require("jsdom").jsdom;
    md5 = require('MD5'),
    fs = require("fs"),
    _ = require("underscore");


function mdfiver(htmlfile) {
    this.head = "";
    this.htmlfile = htmlfile;
    if (this.htmlfile) {
        this.html = fs.readFileSync(htmlfile, "utf8");
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
    ).createWindow().document.getElementsByTagName("html")[0];
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

mdfiver.prototype.fixHtml = function(replaceEntity) {
    var newFileName = createReplaceString(replaceEntity);
    return this.html.replace(replaceEntity.filename, newFileName);
};

mdfiver.prototype.renameFile = function(originalFileNameAndMd5) {
    fs.renameSync(originalFileNameAndMd5.filename, createReplaceString(originalFileNameAndMd5));
};

mdfiver.prototype.handleAssets = function() {
    var files = [];
    var files_with_md5 = [];
    this.parseHead();
    var that = this;
    console.log(this.head.innerHTML);
    var htmlcontent = this.html;
    console.log(this.getScriptTagsPaths());
    files = files.concat(this.getScriptTagsPaths(), this.getCSSTagsPaths());
    console.log(files);
    _.each(files, function(it) {
        var md = that.createMD5FromFile(it);
        that.renameFile(md);
        htmlcontent = that.fixHtml(md);
    });

    fs.writeFileSync(this.htmlfile, htmlcontent);
};

module.exports = mdfiver;
