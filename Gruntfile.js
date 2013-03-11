module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      files: ['grunt.js', 'tasks/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true
      },
      globals: {}
    },
    simplemocha: {
        options: {
            globals: ['expect'],
            ui: 'bdd',
            reported: 'tap'
        },
        all: {
            src: 'test/**/*.js'
        }
    }
  });

  // Load local tasks.
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('test', 'simplemocha');
  grunt.registerTask('default', 'lint test');

};
