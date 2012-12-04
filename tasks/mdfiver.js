/*
 * grunt-mdfiver
 * https://github.com/evilpupu/grunt-mdfiver
 *
 * Copyright (c) 2012 Juha Heimonen
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/gruntjs/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerTask('mdfiver', 'Your task description goes here.', function() {
    grunt.log.write(grunt.helper('mdfiver'));
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  grunt.registerHelper('mdfiver', function() {
    return 'mdfiver!!!';
  });

};
