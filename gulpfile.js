/*jslint node: true */
'use strict';

var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    runSequence = require('run-sequence'),
    es6transpiler = require('gulp-es6-transpiler'),
    clean = require('gulp-clean'),
    newer = require('gulp-newer'),
    nodemon = require('nodemon'),
    spawn = require('child_process').spawn,
    jshint = require('gulp-jshint'),
    stylus = require('gulp-stylus'),
    Datastore = require('nedb');

//-----------------------------------------------------------------------------
var paths = {
    assets: 'assets/',
    views: 'views/',
    src: 'src/',
    build: '.tmp/',
    tests: 'tests/',
    foundation: 'node_modules/zurb-foundation-npm/',
};

var build = {
    src: paths.build + 'src/',
    static: paths.build + 'static/',
    client: paths.build + 'src/client/',
    server: paths.build + 'src/server/',
    views: paths.build + 'views/',
    tests: paths.build + 'tests/',
};

//-----------------------------------------------------------------------------
gulp.task('clean', function () {  
    return gulp.src(paths.build, {read: false})
        .pipe(clean());
});

gulp.task('foundation-css', function() {
    return gulp.src(paths.foundation + 'css/*.css')
        .pipe(gulp.dest(build.static + 'css/'));
});

gulp.task('foundation-js', function() {
    return gulp.src(paths.foundation + '**/*.js')
        .pipe(gulp.dest(build.static));
});

gulp.task('styles', function() {
    return gulp.src(paths.assets + 'styles/**/*.styl')
        .pipe(stylus())
        .pipe(gulp.dest(build.static + 'css/'));
});


gulp.task('es6-to-es5', function() {
    return gulp.src([paths.src + '**/*.js'])
        .pipe(newer(build.src))
        .pipe(es6transpiler())
            .on('error', function (error) {
                console.log(error.stack); 
                this.emit('end'); 
            })
        .pipe(gulp.dest(build.src));
});

gulp.task('move-views', function() {
    return gulp.src(paths.views + '**/*.html')
        .pipe(newer(build.views))
        .pipe(gulp.dest(build.views));
});

gulp.task('create-db', function () {
    var filename = paths.build + 'users.db',
        users_db = new Datastore({filename:filename, autoload:true});

    users_db.insert({username: 'gery', password: 'gery'});
    users_db.insert({username: 'test', password: 'test'});
});

gulp.task('browserify', ['es6-to-es5'], function () {
    browserify('./' + build.client + 'index.js')
        .bundle({debug: true})
        .pipe(source('client.js'))
        .pipe(gulp.dest(build.static + 'js/'));
});

gulp.task('prepare', function (cb) {
    var tasks = [
        'foundation-css',
        'foundation-js',
        'styles',
        'move-views',
        'create-db',
        'browserify',
        'es6-to-es5',
        'tests-es6-to-es5',
    ];
    runSequence('clean', tasks, cb);
});

//-----------------------------------------------------------------------------
gulp.task('develop', ['prepare'], function (done) {
    nodemon({
        script: build.server + 'index.js',
        watch: [build.src, '!' + build.client],
    }).on('log', function (log) { console.log(log.colour); });

    gulp.watch(paths.assets + 'styles/**/*.styl', ['styles']);
    gulp.watch(paths.views + '**/*.html', ['move-views']);
    gulp.watch([paths.src + '**/*.js'], ['es6-to-es5', 'lint']);
    gulp.watch([paths.tests + '**/*.js'], ['tests-es6-to-es5', 'tests-lint']);
    gulp.watch(['./' + build.src + '**/*.js'], ['_run-tests', 'browserify']);
    gulp.watch(['./' + build.tests + '**/*.js'], ['_run-tests']);
});

gulp.task('default', ['develop']);


//-----------------------------------------------------------------------------
gulp.task('lint', function() {
  return gulp.src(paths.src + '**/*.js')
    .pipe(newer(build.src))
    .pipe(jshint({esnext:true}))
    .pipe(jshint.reporter('default'));
});

gulp.task('tests-lint', function() {
  return gulp.src(paths.tests + '**/*.js')
    .pipe(newer(build.tests))
    .pipe(jshint({esnext:true, globals:{describe:false, it:false}}))
    .pipe(jshint.reporter('default'));
});

//-----------------------------------------------------------------------------
gulp.task('tests-es6-to-es5', function() {
    return gulp.src([paths.tests + '**/*.js'])
        .pipe(newer(build.tests))
        .pipe(es6transpiler({globals: {describe: false, it: false}}))
            .on('error', function (err) { 
                console.log(err.stack); 
                this.emit('end');
            })
        .pipe(gulp.dest(build.tests));
});

gulp.task('_run-tests', function (cb) {
    var options = [build.tests, '--recursive','-R','dot'];
    spawn('mocha', options, {stdio: 'inherit'})
        .on('close', cb);
});

gulp.task('run-tests', function (cb) {
    runSequence('prepare', '_run-tests', cb);
});

//-----------------------------------------------------------------------------
gulp.task('start', ['prepare'], function () {
    require('./' + build.server);
});

