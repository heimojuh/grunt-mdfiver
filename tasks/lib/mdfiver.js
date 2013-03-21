var jsdom = require("jsdom").jsdom,
md5 = require('MD5'),
fs = require("fs"),
_ = require("underscore"),
EventEmitter = require('events').EventEmitter;


function mdfiver(options) {
    this.head = "";
    this.basepath = options.basepath || "";
    this.htmlfile = options.htmlfile;
    this.tags = options.tags || [{tag:"script",attr:"src"},{tag:"link",attr:"href"},{tag:"script",attr:"data-main", suffix: ".js"}];
    if (this.htmlfile) {
        this.html = fs.readFileSync(this.htmlfile, "utf8");
    }

}

mdfiver.prototype = Object.create(EventEmitter.prototype);

function createReplaceString(originalFileNameAndMd5) {
    var lastIndexOfPoint = originalFileNameAndMd5.filename.lastIndexOf(".");
    var start = originalFileNameAndMd5.filename.substring(0,lastIndexOfPoint);
    var end = originalFileNameAndMd5.filename.substring(lastIndexOfPoint
    );
    if (start !== "") {
        return start+"_"+originalFileNameAndMd5.md5+end;
    }
    else {
        return originalFileNameAndMd5.filename+"_"+originalFileNameAndMd5.md5;
    }

}

mdfiver.prototype.parseToDom = function() {
    this.head = jsdom( 
        this.html,
        null
    ).createWindow().document.getElementsByTagName("html")[0];
};

mdfiver.prototype.getPaths = function(tag) {
    var that = this;
    var paths = [];
    var suffix = tag.suffix || "";
        _.each(this.head.getElementsByTagName(tag.tag), function(element) {
            var p = element.getAttribute(tag.attr);
            that.emit("log", "found path: "+p);
            if (p) {
                if (p.indexOf("http://") === -1 && p !== "") {
                    paths.push(p+suffix);
                }
                else {
                    that.emit("log", "dropped: "+p);
                }
            }
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
    this.emit("log", "md5 from: "+file);
    var data = fs.readFileSync(this.basepath+file, "utf8");
    return {filename: file, md5:  md5(data)};
};

mdfiver.prototype.fixHtml = function(replaceEntity) {
    var newFileName = createReplaceString(replaceEntity);
    return this.html.replace(replaceEntity.filename, newFileName);
};

mdfiver.prototype.renameFile = function(originalFileNameAndMd5) {
    this.emit("log", "renaming: "+originalFileNameAndMd5.filename);
    fs.renameSync(this.basepath+originalFileNameAndMd5.filename, this.basepath+createReplaceString(originalFileNameAndMd5));
};

mdfiver.prototype.handleAssets = function() {
    var files = [];
    var files_with_md5 = [];
    this.parseToDom();
    var that = this;
    _.each(this.tags, function(it) {
        _.each(that.getPaths(it), function(path) {
            var suffix = it.suffix || "";
            var md = that.createMD5FromFile(path);
            that.renameFile(md);
            md.filename = md.filename.replace(suffix, "");
            that.html = that.fixHtml(md);
        });
    });
    fs.writeFileSync(this.htmlfile, this.html);
};

module.exports = mdfiver;
