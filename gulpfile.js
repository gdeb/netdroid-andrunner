var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    es6transpiler = require('gulp-es6-transpiler'),
    clean = require('gulp-clean'),
    newer = require('gulp-newer'),
    nodemon = require('nodemon'),
    Datastore = require('nedb');

var src_path = 'src',
    assets_path = 'assets',
    build_path = '.tmp',
    server_path = build_path + '/server',
    static_path = build_path + '/static';
    

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
        .pipe(gulp.dest(server_path));
});

gulp.task('create-db', function () {
    var filename = build_path + '/users.db',
        users_db = new Datastore({filename:filename, autoload:true});

    users_db.insert({username: 'gery', password: 'gery'});
    users_db.insert({username: 'test', password: 'test'});
});

gulp.task('prepare', function (cb) {
    var tasks = [
        'foundation-css',
        'foundation-js',
        'css',
        'create-db',
        'server-es6-to-es5'
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
    gulp.watch(src_path + '/**/*.js', ['server-es6-to-es5']);
});

gulp.task('default', ['develop']);



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
