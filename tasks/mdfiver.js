/*
 * grunt-mdfiver
 * https://github.com/evilpupu/grunt-mdfiver
 *
 * Copyright (c) 2012 Juha Heimonen
 * Licensed under the MIT license.
 */

var mdfiver = require('./lib/mdfiver.js');
module.exports = function(grunt) {


  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('mdfiver', 'Cache bust with MD5', function() {

    var done = this.async();
    var options = this.data;
    var mdfive = new mdfiver(options);
    mdfive.on("log", function(msg) {
        grunt.log.writeln(msg);
    });

    mdfive.on("error", function() {
        done(false);
    });
    mdfive.handleAssets();
    done();

  });


};
