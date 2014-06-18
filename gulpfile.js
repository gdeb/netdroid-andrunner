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

var src_path = 'src',
    assets_path = 'assets',
    build_path = '.tmp',
    server_path = build_path + '/server',
    client_path = build_path + '/client',
    static_path = build_path + '/static',
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
        .pipe(gulp.dest(static_path + '/css'));
});

gulp.task('server-es6-to-es5', function() {
    return gulp.src([src_path + '/**/*.js', '!src/client{,/**}'])
        .pipe(newer(server_path))
        .pipe(es6transpiler())
            .on('error', function (error) { console.log(error.stack); this.emit('end'); })
        .pipe(gulp.dest(server_path));
});

gulp.task('client-es6-to-es5', function() {
    return gulp.src([src_path + '/client/**/*.js'])
        .pipe(newer(client_path))
        .pipe(es6transpiler())
            .on('error', function (error) { console.log(error.stack); this.emit('end'); })
        .pipe(gulp.dest(client_path));
});

gulp.task('create-db', function () {
    var filename = build_path + '/users.db',
        users_db = new Datastore({filename:filename, autoload:true});

    users_db.insert({username: 'gery', password: 'gery'});
    users_db.insert({username: 'test', password: 'test'});
});

gulp.task('browserify', ['client-es6-to-es5'], function () {
    browserify('./' + client_path + '/index.js').bundle({debug: true})
        .pipe(source('lobby.js'))
        .pipe(gulp.dest(static_path + '/js'));
});

gulp.task('prepare', function (cb) {
    var tasks = [
        'foundation-css',
        'foundation-js',
        'css',
        'create-db',
        'browserify',
        'server-es6-to-es5',
        'tests-es6-to-es5',
    ];
    runSequence('clean', tasks, cb);
});

//-----------------------------------------------------------------------------
gulp.task('develop', ['prepare'], function (done) {
    nodemon({
        script: './.tmp/server/server/index.js',
        watch: ['./.tmp/server']
    }).on('log', function (log) { console.log(log.colour); });

    gulp.watch('assets/styles/*.css', ['css']);
    gulp.watch([src_path + '/**/*.js', '!src/client{,/**}'], ['server-es6-to-es5']);
    gulp.watch([src_path + '/**/*.js', '!src/server{,/**}'], ['client-es6-to-es5']);
    gulp.watch(['tests/**/*.js'], ['run-tests']);
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

gulp.task('run-tests', ['tests-es6-to-es5'], function (cb) {
    var tests = spawn('mocha', [tests_path, '--recursive','-R','spec'], {stdio: 'inherit'});
    tests.on('close', cb);
});

    // rename = require('gulp-rename'),
    // browserify = require('gulp-browserify'), // BLACKLISTED
    // uglify = require('gulp-uglify'),
    // spawn = require('child_process').spawn;


// gulp.task('css', function() {
//     return gulp.src('src/client/css/*.css')
//         .pipe(gulp.dest('static/css/'));
// });

// gulp.task('html', function() {
//     return gulp.src('src/client/html/*.html')
//         .pipe(gulp.dest('static/'));
// });

// gulp.task('js', function() {
//     return gulp.src('src/client/js/index.js')
//         .pipe(rename({basename: 'netrunner'}))
//         .pipe(browserify({
//             insertGlobals : true,
//             debug : true,
//         }))
//         .pipe(traceur({sourceMap: true, experimental: true}))
//         .pipe(gulp.dest('static/js/'));
// });

// gulp.task('traceur_runtime', function () {
//     return gulp.src('node_modules/traceur/bin/traceur-runtime.js')
//         // .pipe(uglify())
//         .pipe(gulp.dest('static/js/'));
// });

// //-----------------------------------------------------------------------------
// gulp.task('test', function (cb) {
//     var tests = spawn('mocha', ['tests', '--recursive','-R','spec'], {stdio: 'inherit'});
//     tests.on('close', cb);

//     tests.on('error', function () {
//         console.log('Failure...');
//         cb();
//     });

// });

// //-----------------------------------------------------------------------------
// gulp.task('prepare', function (cb) {
//     runSequence('clean', ['css','js', 'html', 'traceur_runtime'], cb);
// });

// //-----------------------------------------------------------------------------
// gulp.task('develop', ['prepare'], function (done) {
//     nodemon({
//         script: './src/server/index.js',
//         watch: ['./src/server', './src/common']
//     }).on('log', function (log) { console.log(log.colour); });

//     gulp.watch('src/client/css/*.css', ['css']);
//     gulp.watch('src/client/js/*.js', ['js']);
//     gulp.watch('src/client/html/*.html', ['html']);

//     gulp.watch('src/**/*.js', ['test']);
//     gulp.watch('tests/**/*.js', ['test']);
// });

// //-----------------------------------------------------------------------------
// gulp.task('serve', ['prepare'], function () {
//     require('./src/server');
// });

// //-----------------------------------------------------------------------------
// gulp.task('default', ['develop']);
