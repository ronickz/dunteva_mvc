import gulp from 'gulp';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';

gulp.task('minifyJS', function () {
    return gulp.src('./src/js/**/*.js')  // Toma todos los archivos JS dentro de /js
        .pipe(uglify()) // Minifica el código
        .pipe(gulp.dest('./public/js')); // Guarda en /dist/js
});

gulp.task('watch', function () {
    gulp.watch('./src/js/**/*.js', gulp.series('minifyJS')); // Ejecuta minifyJS al detectar cambios
})

// Tarea por defecto
gulp.task('default', gulp.series('minifyJS'));
