var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('develop', function () {
  nodemon({ script: 'src/index.js', ext: 'html js'});
});