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
    Datastore = require('nedb');

//-----------------------------------------------------------------------------
var assets_path = 'assets',
    view_path = 'views',
    build_path = '.tmp',
    static_path = build_path + '/static',
    src_path = 'src',
    build_src_path = build_path + '/src',
    server_path = build_src_path + '/server',
    client_path = build_src_path + '/client',
    views_bpath = build_path + '/views',
    tests_path = build_path + '/tests';    

//-----------------------------------------------------------------------------
gulp.task('clean', function () {  
    return gulp.src(build_path, {read: false})
        .pipe(clean());
});

gulp.task('foundation-css', function() {
    return gulp.src('node_modules/zurb-foundation-npm/css/*.css')
        .pipe(gulp.dest(static_path + '/css'));
});

gulp.task('foundation-js', function() {
    return gulp.src('node_modules/zurb-foundation-npm/**/*.js')
        .pipe(gulp.dest(static_path));
});

gulp.task('css', function() {
    return gulp.src(assets_path + '/styles/*.css')
        .pipe(newer(static_path + '/css'))
        .pipe(gulp.dest(static_path + '/css'));
});

gulp.task('es6-to-es5', function() {
    return gulp.src([src_path + '/**/*.js'])
        .pipe(newer(build_src_path))
        .pipe(es6transpiler())
            .on('error', function (error) { console.log(error.stack); this.emit('end'); })
        .pipe(gulp.dest(build_src_path));
});

gulp.task('move-views', function() {
    return gulp.src(view_path + '/**/*.html')
        .pipe(newer(views_bpath))
        .pipe(gulp.dest(views_bpath));
});

gulp.task('create-db', function () {
    var filename = build_path + '/users.db',
        users_db = new Datastore({filename:filename, autoload:true});

    users_db.insert({username: 'gery', password: 'gery'});
    users_db.insert({username: 'test', password: 'test'});
});

gulp.task('browserify', ['es6-to-es5'], function () {
    browserify('./' + client_path + '/index.js')
        .bundle({debug: true})
        .pipe(source('lobby.js'))
        .pipe(gulp.dest(static_path + '/js'));
});

gulp.task('prepare', function (cb) {
    var tasks = [
        'foundation-css',
        'foundation-js',
        'css',
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
        script: server_path + '/index.js',
        watch: [build_src_path, '!' + client_path],
    }).on('log', function (log) { console.log(log.colour); });

    gulp.watch('assets/styles/*.css', ['css']);
    gulp.watch(view_path + '/**/*.html', ['move-views']);
    gulp.watch([src_path + '/**/*.js'], ['es6-to-es5']);
    gulp.watch(['tests/**/*.js'], ['tests-es6-to-es5']);
    gulp.watch(['./.tmp/src/**/*.js'], ['_run-tests']);
    gulp.watch(['./.tmp/tests/**/*.js'], ['_run-tests']);
});

gulp.task('default', ['develop']);


//-----------------------------------------------------------------------------
gulp.task('tests-es6-to-es5', function() {
    return gulp.src(['tests' + '/**/*.js'])
        .pipe(newer(tests_path))
        .pipe(es6transpiler({globals: {describe: false, it: false}}))
            .on('error', function (err) { console.log(err.stack); this.emit('end');})
        .pipe(gulp.dest(tests_path));
});

gulp.task('_run-tests', function (cb) {
    var tests = spawn('mocha', [tests_path, '--recursive','-R','spec'], {stdio: 'inherit'});
    tests.on('close', cb);
});

gulp.task('run-tests', function (cb) {
    runSequence('prepare', '_run-tests', cb);
});

//-----------------------------------------------------------------------------
gulp.task('start', ['prepare'], function () {
    require('./' + server_path);
});

