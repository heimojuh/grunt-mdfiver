var grunt = require('grunt'),
    expect = require('expect.js'),
    fs = require("fs"),
    mdfiver = require('../../tasks/lib/mdfiver');

describe('mdfiver tests', function() {

    function createTestFile(file) {
        fs.writeFileSync(file, "testcontent", "utf8");
        return md.createMD5FromFile(file).md5;
    }
    var plainHtml = "<html><head>HEAD CONTENT</head><body></body><html>";
    var scriptHtml = "<html><head><script type='text/javascript' src='foo/script.js'></script></head><body></body><html>";
    var cssHtml = "<html><head><script type='text/javascript' src='foo/script.js'></script><LINK href='foo/styles.css' rel='stylesheet' type='text/css'></head><body></body><html>";
    var testfile = "test/data/index.html";
    var md = new mdfiver();

    it("mdfiver has empty head", function() {
        expect(md.head).to.be("");
    });

    it("Head content after parseHead is HEAD CONTENT", function() {
       md.html = plainHtml;
       md.parseHead();
       expect(md.head.innerHTML).to.be("HEAD CONTENT");
    });

    it("Get's script tag path from head", function(){
        md.html = scriptHtml;
        md.parseHead();
        expect(md.getScriptTagsPaths()[0]).to.be("foo/script.js");
    });

    it("Get's LINK tag from head", function() {
        md.html = cssHtml;
        md.parseHead();
        expect(md.getCSSTagsPaths()[0]).to.be("foo/styles.css");
    });

    it("Calculates MD5 from given file and returns {filename: md5}", function() {
        expect(md.createMD5FromFile(testfile)).to.eql({filename: testfile, md5: "9e4b0fb7f0847c3d5d370f9f0b1d8266"});
    });

    it("replaces filename with md5 amended version based on fed object", function() {
        var filecontent = fs.readFileSync(testfile);
        md.html = filecontent;
        md.parseHead(filecontent);
        var fixedHead = md.fixHeadEntry({filename: "css/bootstrap-responsive.min.css", md5: "6969"});
        expect(fixedHead.indexOf("css/bootstrap-responsive.min_6969.css")).not.to.be(-1);
    });

    it("renames file on filesystem", function() {
        var testf = "test/tmp/testfile.txt";
        var md5hash = createTestFile(testf);
        var endResult = "test/tmp/testfile_"+md5hash+".txt";
        md.renameFile({filename: testf, md5: md5hash});
        expect(fs.existsSync(endResult)).to.be.ok();
        fs.unlink(endResult);
    });
});
