var moment = require('moment');
var path = require('path');

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var timestampMs = (new Date()).getTime();
  var timestamp = moment().format('ddd ll HH:mmZZ') + ' [ ' + timestampMs + ' ]';

  var cfg = require('./src/precompile/asset-config');

  grunt.initConfig({
    clean: {
      options: {
        force: true
      },
      dist: {
        src: cfg.outputDir
      },
      angular: {
        src: cfg.angular.cleanup
      }
    },
    stylus: {
      dist: {
        options: {
          import: ['nib'], // use stylus plugin at compile time
          linenos: true,
          compress: false
        },
        files: [
          {
            src: cfg.stylus.src,
            dest: cfg.stylus.dest
          }
        ]
      }
    },
    cssmin: {
      dist: {
        options:{
          keepSpecialComments: 0,
          banner : '/* Minified via CssMin ' + timestamp + ' */'
        },
        files: [
          {
            src: cfg.stylus.dest,
            dest: cfg.stylus.dest
          }
        ]
      }
    },
    jade: {
      dist: {
        options: {
          pretty: true,
          data: {
            cacheKey: timestampMs,
            env: 'dev'
          }
        },
        files: [
          {
            expand: true,
            cwd: cfg.jade.cwd,
            src: cfg.jade.src,
            dest: cfg.jade.dest,
            ext: '.html'
          }
        ]
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [
          {
            expand: true,
            cwd: cfg.htmlmin.cwd,
            src: cfg.htmlmin.src,
            dest: cfg.htmlmin.dest
          }
        ]
      }
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd: cfg.copy.cwd,
            src: cfg.copy.src,
            dest: cfg.copy.dest,
            flatten: false
          }
        ]
      }
    }
  });

  // Environment agnostic
  grunt.registerTask('preprocess', [
    'clean:dist',
  ]);

  grunt.registerTask('postprocess', [
    'clean:angular'
  ]);

  // Dev build
  grunt.registerTask('dev', [
    'preprocess',
    'jade:dev',
    // 'copy:assets',
    // 'copy:js',
    'stylus:dist',
    // 'concat:dev',
    // 'jshint',
    // 'ngAnnotate',
    // 'uglify:devNg',
    // 'prettify',
    'postprocess'
  ]);

  // Alias for Prod build
  grunt.registerTask('prod', [
    'default'
  ]);

  // Dev watcher
  grunt.registerTask('watcher', 'Fires minify css and js, then watches for changes', [
    'dev',
    // 'concurrent'
  ]);

  // Prod build (default task)
  grunt.registerTask('default', [
    'preprocess',
    'jade:prod',
    // 'copy:assets',
    // 'copy:js',
    'stylus:dist',
    'cssmin:dist',
    // 'ngAnnotate',
    // 'uglify:prodNg',
    // 'uglify:prodNgCommon',
    'postprocess'
  ]);
};