/*jslint node: true */
'use strict';

require('grunt-traceur');

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-traceur');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // compile es6 into es5
        //--------------------------------------------------
        traceur: {
            options: {
                experimental: true,
                blockBinding: true,
            },
            custom: {
                files:{
                    'public/all.js': ['static/js/**/*.js']
                }
            },
        },
        // copy all useful files from static/ to build/
        //--------------------------------------------------
        copy: {
          main: {
            files: [
              {expand: true, flatten:true, src: ['static/css/*'], dest: 'public/', filter: 'isFile'},
              {expand: true, flatten:true, src: ['static/html/*'], dest: 'public/', filter:'isFile'},
              {expand: true, flatten:true, src: ['node_modules/traceur/bin/traceur-runtime.js'], dest: 'public/', filter: 'isFile'},
            ]
          }
        },

        // copy all useful files from static/ to build/
        //--------------------------------------------------
        watch: {
            scripts: {
                files: ['static/js/**/*.js', 'static/css/*', 'static/html/*'],
                tasks: ['traceur', 'copy'],
            }
        },

        //--------------------------------------------------
        exec: {
          make_public_dir: {
            command: 'mkdir public'
          },
          launch_server: {
            command: 'nodemon src/index.js',
          },
        },
    });


    grunt.registerTask('init', ['exec:make_public_dir', 'copy','traceur']);
    grunt.registerTask('start-dev', ['watch', 'exec:launch_server']);
    grunt.registerTask('default', 'watch');
    // grunt.registerTask('copy', 'copy');

};