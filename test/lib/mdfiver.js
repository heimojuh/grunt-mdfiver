var grunt = require('grunt'),
    expect = require('expect.js'),
    fs = require("fs"),
    wrench = require("wrench"),
    mdfiver = require('../../tasks/lib/mdfiver');

describe('mdfiver tests', function() {

    function createTestFile(file) {
        fs.writeFileSync(file, "testcontent", "utf8");
        return md.createMD5FromFile(file).md5;
    }
    var plainHtml = "<html><head>HEAD CONTENT</head><body></body><html>";
    var scriptHtml = "<html><head><script type='text/javascript' src='foo/script.js'></script></head><body></body><html>";
    var scriptHtmlRjs = "<html><head><script type='text/javascript' src='foo/require.js' data-main='foo/script'></script></head><body></body><html>";
    var scriptHtmlRjs_withDot = "<html><head><script type='text/javascript' src='foo/require.js' data-main='foo/script.min'></script></head><body></body><html>";
    var cssHtml = "<html><head><script type='text/javascript' src='foo/script.js'></script><LINK href='foo/styles.css' rel='stylesheet' type='text/css'></head><body></body><html>";
    var testfile = "test/data/index.html";
    var md = new mdfiver({});

    before(function() {
        fs.mkdirSync("test/tmp");
    });

    after(function() {
        wrench.rmdirSyncRecursive("test/tmp");
    });

    it("mdfiver has empty head", function() {
        expect(md.head).to.be("");
    });

    it("Head content after parseToDom to contain HEAD CONTENT", function() {
       md.html = plainHtml;
       md.parseToDom();
       expect(md.head.innerHTML).to.contain("HEAD CONTENT");
    });

    it("Get's script tag path from head", function(){
        md.html = scriptHtml;
        md.parseToDom();
        expect(md.getPaths({tag:"script", attr:"src"})[0]).to.be("foo/script.js");
    });

    it("Returns empty array on empty head", function() {
        md.html = "<html><head></head></html>";
        md.parseToDom();
        expect(md.getPaths({tag:"script",attr:"src"})).to.be.empty();
    });
    
    it("returns false on http starting url", function() {
        expect(md.checkIfValidUrl("http://foo")).not.to.be.ok();
    });

    it("returns false on https starting url", function() {
        expect(md.checkIfValidUrl("https://foo")).not.to.be.ok();
    });

    it("Get's LINK tag from head", function() {
        md.html = cssHtml;
        md.parseToDom();
        expect(md.getPaths({tag:"link",attr:"href"})[0]).to.be("foo/styles.css");
    });

    it("Calculates MD5 from given file and returns {filename: md5}", function() {
        expect(md.createMD5FromFile(testfile)).to.eql({filename: testfile, md5: "4b0c677657abab51c6aa792fed43734a"});
    });

    it("replaces filename with md5 amended version based on fed object", function() {
        var filecontent = fs.readFileSync(testfile, "utf8");
        md.html = filecontent;
        var fixed = md.fixHtml({filename: "css/bootstrap-responsive.min.css", md5: "6969"});
        expect(fixed.indexOf("css/bootstrap-responsive.min_6969.css")).not.to.be(-1);
    });
    it("replaces filename with md5 amended version based on fed object with suffix", function() {
        var filecontent = fs.readFileSync(testfile, "utf8");
        md.html = filecontent;
        var fixed = md.fixHtml({filename: "js/boot.min", md5: "6969", suffix: "js"});
        expect(fixed.indexOf("js/boot.min_6969")).not.to.be(-1);
    });

    it("renames file on filesystem", function() {
        var testf = "test/tmp/testfile.txt";
        var md5hash = createTestFile(testf);
        var endResult = "test/tmp/testfile_"+md5hash+".txt";
        md.renameFile({filename: testf, md5: md5hash});
        expect(fs.existsSync(endResult)).to.be.ok();
        fs.unlink(endResult);
    });
    it("renames file with . in name on filesystem", function() {
        var testf = "test/tmp/testfile.min.js";
        var md5hash = createTestFile(testf);
        var endResult = "test/tmp/testfile.min_"+md5hash+".js";
        md.renameFile({filename: testf, md5: md5hash});
        expect(fs.existsSync(endResult)).to.be.ok();
        fs.unlink(endResult);
    });
    it("renames file with . in name on filesystem with suffix", function() {
        var testf = "test/tmp/testfile.min.js";
        var md5hash = createTestFile(testf);
        var endResult = "test/tmp/testfile.min_"+md5hash+".js";
        md.renameFile({filename: "test/tmp/testfile.min", md5: md5hash, suffix: ".js"});
        expect(fs.existsSync(endResult)).to.be.ok();
        fs.unlink(endResult);
    });

    it("handles assets", function() {
        var html = "<html><head><script type='text/javascript' src='test/tmp/testfile.js'></script></head><body></body></html>";
        var htmlfile = "test/tmp/html.html";
        fs.writeFileSync(htmlfile, html);
        var testf = "test/tmp/testfile.js";
        var md5hash = createTestFile(testf);
        var endResult = "test/tmp/testfile_"+md5hash+".js";
        md.html = html;
        md.htmlfile = htmlfile;
        md.handleAssets();
        expect(fs.existsSync(endResult)).to.be.ok();
        fs.unlink(endResult);
        fs.unlink(htmlfile);

    });
});
