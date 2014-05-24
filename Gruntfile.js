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
        //--------------------------------------------------
        traceur: {
            options: {
                experimental: true,
                blockBinding: true,
            },
            custom: {
                files:{'public/all.js': ['static/js/**/*.js']}
            },
        },
        //--------------------------------------------------
        copy: {
            css: {
                files: [{
                    expand: true, flatten:true, src: ['static/css/*'], 
                    dest: 'public/', filter: 'isFile'
                }]
            },
            html: {
                files: [{
                    expand: true, flatten:true, src: ['static/html/*'], 
                    dest: 'public/', filter:'isFile'
                }]
            },
            traceur_runtime: {
                files: [{
                    expand: true, flatten:true, src: ['node_modules/traceur/bin/traceur-runtime.js'], 
                    dest: 'public/', filter: 'isFile'
                }]
            }
        },
        //--------------------------------------------------
        watch: {
            html_css: {
                files: ['static/css/*', 'static/html/*'],
                tasks: ['copy'],
                options: {spawn: false}
            },
            client_js: {
                files: ['static/js/**/*.js'],
                tasks: ['traceur'],
                options: {spawn: false}                
            },
        },
        //--------------------------------------------------
        exec: {
          make_public_dir: {
            command: 'mkdir public'
          },
          launch_server: {
            command: 'nodemon --harmony src/index.js',
          },
        },
    });

    grunt.registerTask('init', ['exec:make_public_dir', 'copy','traceur']);
    grunt.registerTask('start', ['exec:launch_server']);
    grunt.registerTask('default', 'start');

};