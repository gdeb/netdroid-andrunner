/*jslint node: true */
'use strict';

var gulp = require('gulp'),
    newer = require('gulp-newer'),
    es6transpiler = require('gulp-es6-transpiler'),
    runSequence = require('run-sequence'),
    nodemon = require('nodemon'),
    concat = require('gulp-concat'),
    flatten = require('gulp-flatten'),
    // source = require('vinyl-source-stream'),
    jshint = require('gulp-jshint'),
    browserify = require('gulp-browserify'),
    uglify = require('gulp-uglify'),
    rimraf = require('rimraf');

//-----------------------------------------------------------------------------
// Settings

var BUILD = './_build/';

//-----------------------------------------------------------------------------
gulp.task('clean', function (cb) {  
    rimraf(BUILD, cb);
});

gulp.task('transpile-es6-to-es5', function() {
    return gulp.src(['src/**/*.js'])
        .pipe(newer(BUILD))
        .pipe(es6transpiler({globals:{netdroid:false, angular:false}}))
            .on('error', function (error) {
                console.log(error.stack); 
                this.emit('end'); 
            })
        .pipe(gulp.dest(BUILD));
});

gulp.task('transpile-tests', function (cb) {
    return gulp.src(['./tests/*.js'])
        // .pipe(newer(BUILD + '/tests'))
        .pipe(es6transpiler({globals:{describe:false, it: false}}))
            .on('error', function (error) {
                console.log(error.stack); 
                this.emit('end'); 
            })
        .pipe(gulp.dest(BUILD + '/tests'));        
});

gulp.task('prepare-json', function (cb) {
    return gulp.src(['src/**/*.json'])
        .pipe(newer(BUILD))
        .pipe(gulp.dest(BUILD));
});

gulp.task('browserify', function () {
    gulp.src(BUILD + '/client/app.js', {read: false})
        .pipe(browserify())
        // .pipe(uglify({mangle:false}))
        // .pipe(rename('app.js'))
        .pipe(gulp.dest(BUILD + '/static'));
});

gulp.task('prepare-html', function () {
    return gulp.src(['src/client/**/*.html'])
        .pipe(flatten())
        .pipe(gulp.dest(BUILD + '/html'));
});

gulp.task('prepare-config', function () {
    return gulp.src(['config/**/*.json'])
        .pipe(newer(BUILD + '/server/'))
        .pipe(gulp.dest(BUILD + '/server/'));
});

gulp.task('prepare-css', function () {
    return gulp.src(['src/client/**/*.css'])
        .pipe(concat('netdroid.css'))
        .pipe(gulp.dest(BUILD + '/static'));
});

gulp.task('prepare', function (cb) {
    var tasks = [
        'transpile-es6-to-es5',
        'prepare-html',
        'prepare-css',
        'prepare-json',
        'prepare-config',
    ];
    runSequence('clean', tasks, 'browserify', cb);
});

gulp.task('watch', function (cb) {
    gulp.watch(['src/**/*.js'], ['transpile-es6-to-es5']);
    gulp.watch(['tests/**/*.js'], ['transpile-tests']);
    gulp.watch([BUILD + '/client/**/*.js'], ['browserify']);
    gulp.watch(['src/client/**/*.html'], ['prepare-html']);
    gulp.watch(['src/client/**/*.css'], ['prepare-css']);
    gulp.watch(['src/**/*.json'], ['prepare-json']);
    gulp.watch(['config/**/*.json'], ['prepare-config']);
});

gulp.task('lint', function() {
  return gulp.src('src/**/*.js')
    .pipe(jshint({esnext:true, globals:{WebSocket:false, angular: false}}))
    .pipe(jshint.reporter('default'));
});

//-----------------------------------------------------------------------------
gulp.task('serve', function () {
    process.env.NODE_ENV = 'development';

    nodemon({
        script: '_build/server/index.js',
        ext: 'js json',
        watch: ['_build/server'],
    }).on('log', function (log) { console.log(log.colour); });

});

gulp.task('default', ['develop']);

gulp.task('repl', function (cb) {
    require(BUILD + '/server/repl.js');
});

gulp.task('run-tests', function () {
    require(BUILD + '/tests/');
});

gulp.task('develop', function (cb) {
    runSequence('prepare', ['serve', 'watch']);
});