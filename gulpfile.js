/*jslint node: true */
'use strict';

var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    source = require('vinyl-source-stream'),
    runSequence = require('run-sequence'),
    es6transpiler = require('gulp-es6-transpiler'),
    clean = require('gulp-clean'),
    newer = require('gulp-newer'),
    nodemon = require('nodemon'),
    jshint = require('gulp-jshint'),
    stylus = require('gulp-stylus');

//-----------------------------------------------------------------------------
// Settings

var HTTP_PORT = require('./config.json').http_port,
    WS_PORT = require('./config.json').ws_port,
    BUILD = require('./config.json').paths.build,
    TESTS = require('./config.json').paths.tests,
    PUBLIC = require('./config.json').paths.public_files,
    RESOURCES = require('./config.json').paths.resources,
    TEMPLATES = require('./config.json').paths.templates,
    SRC = require('./config.json').paths.src;

//-----------------------------------------------------------------------------
gulp.task('clean', function () {  
    return gulp.src(BUILD, {read: false})
        .pipe(clean());
});

gulp.task('styles', function() {
    return gulp.src(RESOURCES + '/styles/**/*.styl')
        .pipe(stylus())
        .pipe(gulp.dest(PUBLIC + '/css/'));
});

gulp.task('es6-to-es5', function() {
    return gulp.src([SRC + '/**/*.js'])
        .pipe(newer(BUILD + '/src/'))
        .pipe(es6transpiler({globals:{netdroid:false}}))
            .on('error', function (error) {
                console.log(error.stack); 
                this.emit('end'); 
            })
        .pipe(gulp.dest(BUILD + '/src/'));
});

gulp.task('lint', function() {
  return gulp.src(SRC + '/**/*.js')
    .pipe(jshint({esnext:true, globals:{WebSocket:false}}))
    .pipe(jshint.reporter('default'));
});

gulp.task('lint-newer-files', function() {
  return gulp.src(SRC + '/**/*.js')
    .pipe(newer(BUILD + '/src'))
    .pipe(jshint({esnext:true, globals:{WebSocket:false}}))
    .pipe(jshint.reporter('default'));
});


gulp.task('browserify', function () {
    return gulp.src(BUILD + '/src/client/**/*.js')
        .pipe(browserify({debug:true}))
        .pipe(gulp.dest(PUBLIC + '/js/'));
});

gulp.task('prepare', function (cb) {
    var tasks = [
        'styles',
        'es6-to-es5',
        'lint',
    ];
    runSequence('clean', tasks, 'browserify', cb);
});

//-----------------------------------------------------------------------------
gulp.task('serve', function () {
    nodemon({
        script: BUILD + '/src/server.js',
        ext: 'js json',
        watch: [BUILD + '/src', '!' + BUILD + '/src/client/'],
        args : [HTTP_PORT, WS_PORT],
    }).on('log', function (log) { console.log(log.colour); });

});

//-----------------------------------------------------------------------------
gulp.task('develop', ['prepare'], function (done) {
    gulp.watch(RESOURCES + '/styles/**/*.styl', ['styles']);
    gulp.watch([SRC + '/**/*.js'], ['es6-to-es5', 'lint-newer-files']);
    gulp.watch(BUILD + '/src/**/*.js', ['browserify']);
});

gulp.task('default', ['develop']);
