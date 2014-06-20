/*jslint node: true */
'use strict';

var gulp = require('gulp'),
    // browserify = require('browserify'),
    browserify = require('gulp-browserify'),
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

var paths = require("./config/paths.json");

//-----------------------------------------------------------------------------
gulp.task('clean', function () {  
    return gulp.src(paths.build_target, {read: false})
        .pipe(clean());
});

gulp.task('foundation-css', function() {
    return gulp.src(paths.vendor.foundation + 'css/*.css')
        .pipe(gulp.dest(paths.build.static + 'css/'));
});

gulp.task('foundation-js', function() {
    return gulp.src(paths.vendor.foundation + '**/*.js')
        .pipe(gulp.dest(paths.build.static));
});

gulp.task('styles', function() {
    return gulp.src(paths.assets + 'styles/**/*.styl')
        .pipe(stylus())
        .pipe(gulp.dest(paths.build.static + 'css/'));
});


gulp.task('es6-to-es5', function() {
    return gulp.src([paths.src + '**/*.js'])
        .pipe(newer(paths.build.src))
        .pipe(es6transpiler())
            .on('error', function (error) {
                console.log(error.stack); 
                this.emit('end'); 
            })
        .pipe(gulp.dest(paths.build.src));
});

gulp.task('move-views', function() {
    return gulp.src(paths.views + '**/*.html')
        .pipe(newer(paths.build.views))
        .pipe(gulp.dest(paths.build.views));
});

gulp.task('move-config', function() {
    return gulp.src(paths.config + '**/*.json')
        .pipe(newer(paths.build.config))
        .pipe(gulp.dest(paths.build.config));
});

gulp.task('create-db', function () {
    var filename = paths.build.db + 'users.db',
        users_db = new Datastore({filename:filename, autoload:true});

    var users = require('./' + paths.config + 'db.json').users;
    users.forEach(function (user) {
        users_db.insert(user);
    });
});

gulp.task('browserify', ['es6-to-es5'], function () {
    return gulp.src(paths.build.client + '**/*.js')
        .pipe(browserify({debug:true}))
        .pipe(gulp.dest(paths.build.static + 'js/'));

});

// gulp.task('browserify', ['es6-to-es5'], function () {
//     browserify('./' + paths.build.client + 'index.js')
//         .bundle({debug: true})
//         .pipe(source('client.js'))
//         .pipe(gulp.dest(paths.build.static + 'js/'));
// });

gulp.task('prepare', function (cb) {
    var tasks = [
        'foundation-css',
        'foundation-js',
        'styles',
        'move-views',
        'move-config',
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
        script: paths.build.server + 'index.js',
        env: {'CONFIG_FOLDER': __dirname + '/' + paths.build.config},
        ext: 'js json',
        watch: [paths.build.src, paths.build.config, '!' + paths.build.client],
    }).on('log', function (log) { console.log(log.colour); });

    gulp.watch(paths.assets + 'styles/**/*.styl', ['styles']);
    gulp.watch(paths.views + '**/*.html', ['move-views']);
    gulp.watch(paths.config + '**/*.json', ['move-config']);
    gulp.watch([paths.src + '**/*.js'], ['es6-to-es5', 'lint']);
    gulp.watch([paths.tests + '**/*.js'], ['tests-es6-to-es5', 'tests-lint']);
    gulp.watch(['./' + paths.build.src + '**/*.js'], ['_run-tests', 'browserify']);
    gulp.watch(['./' + paths.build.tests + '**/*.js'], ['_run-tests']);
});

gulp.task('default', ['develop']);


//-----------------------------------------------------------------------------
gulp.task('lint', function() {
  return gulp.src(paths.src + '**/*.js')
    .pipe(newer(paths.build.src))
    .pipe(jshint({esnext:true}))
    .pipe(jshint.reporter('default'));
});

gulp.task('tests-lint', function() {
  return gulp.src(paths.tests + '**/*.js')
    .pipe(newer(paths.build.tests))
    .pipe(jshint({esnext:true, globals:{describe:false, it:false}}))
    .pipe(jshint.reporter('default'));
});

//-----------------------------------------------------------------------------
gulp.task('tests-es6-to-es5', function() {
    return gulp.src([paths.tests + '**/*.js'])
        .pipe(newer(paths.build.tests))
        .pipe(es6transpiler({globals: {describe: false, it: false}}))
            .on('error', function (err) { 
                console.log(err.stack); 
                this.emit('end');
            })
        .pipe(gulp.dest(paths.build.tests));
});

gulp.task('_run-tests', function (cb) {
    var options = [paths.build.tests, '--recursive','-R','dot'];
    spawn('mocha', options, {stdio: 'inherit'})
        .on('close', cb);
});

gulp.task('run-tests', function (cb) {
    runSequence('prepare', '_run-tests', cb);
});

//-----------------------------------------------------------------------------
gulp.task('start', ['prepare'], function () {
    require('./' + paths.build.server);
});

