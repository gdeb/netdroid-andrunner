var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    // rename = require('gulp-rename'),
    // browserify = require('gulp-browserify'),
    // uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    nodemon = require('nodemon');
    // spawn = require('child_process').spawn;

//-----------------------------------------------------------------------------
gulp.task('start-server', ['prepare'], function () {
    require('./src/server');
});

gulp.task('develop', ['prepare'], function (done) {
    nodemon({
        script: './src/server/index.js',
        watch: ['./src']
    }).on('log', function (log) { console.log(log.colour); });

    gulp.watch('assets/styles/*.css', ['css']);

});

//-----------------------------------------------------------------------------
gulp.task('default', ['develop']);

//-----------------------------------------------------------------------------
gulp.task('clean', function () {  
    return gulp.src('.tmp', {read: false})
        .pipe(clean());
});

gulp.task('foundation-css', function() {
    return gulp.src('node_modules/zurb-foundation-npm/css/*.css')
        .pipe(gulp.dest('.tmp/css/'));
});

gulp.task('foundation-js', function() {
    return gulp.src('node_modules/zurb-foundation-npm/**/*.js')
        .pipe(gulp.dest('.tmp/'));
});

gulp.task('css', function() {
    return gulp.src('assets/styles/*.css')
        .pipe(gulp.dest('.tmp/css/'));
});

gulp.task('prepare', function (cb) {
    runSequence('clean', ['foundation-css', 'foundation-js', 'css'], cb);
});


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
