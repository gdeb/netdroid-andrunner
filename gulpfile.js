var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    runSequence = require('run-sequence'),
    traceur = require('gulp-traceur'),
    clean = require('gulp-clean');

//-----------------------------------------------------------------------------
gulp.task('clean', function () {  
    return gulp.src('static', {read: false})
        .pipe(clean());
});

gulp.task('css', function() {
    return gulp.src('src/client/css/*.css')
        .pipe(gulp.dest('static/css/'));
});

gulp.task('html', function() {
    return gulp.src('src/client/html/*.html')
        .pipe(gulp.dest('static/'));
});

gulp.task('js', function() {
    return gulp.src('src/client/**/*.js')
        .pipe(traceur({sourceMap: true, experimental: true}))
        .pipe(gulp.dest('static/'));
});

gulp.task('traceur_runtime', function () {
    return gulp.src('node_modules/traceur/bin/traceur-runtime.js')
        .pipe(gulp.dest('static/js/'));
});

//-----------------------------------------------------------------------------
gulp.task('prepare', function (cb) {
    runSequence('clean', ['css','js', 'html', 'traceur_runtime'], cb);
});

//-----------------------------------------------------------------------------
gulp.task('develop', ['prepare'], function () {
    nodemon({ 
        script: './src/server/index.js', 
        watch: ['./src/server', './src/common'],
        options: '--harmony',
        ext: 'js',
    });
    gulp.watch('src/client/css/*.css', ['css']);
    gulp.watch('src/client/js/*.js', ['js']);
    gulp.watch('src/client/html/*.html', ['html']);
});

//-----------------------------------------------------------------------------
gulp.task('serve', ['prepare'], function () {
    require('./src/server');
});

//-----------------------------------------------------------------------------
gulp.task('default', ['develop']);
