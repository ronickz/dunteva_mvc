import gulp from 'gulp';
import uglify from 'gulp-uglify';
import cleanCSS from 'gulp-clean-css'; // Importa gulp-clean-css
import rename from 'gulp-rename';

// Tarea para minificar JavaScript
gulp.task('minifyJS', function () {
    return gulp.src('./src/js/**/*.js')  // Toma todos los archivos JS dentro de /js
        .pipe(uglify()) // Minifica el código
        .pipe(gulp.dest('./public/js')); // Guarda en /public/js
});

// Tarea para minificar CSS
gulp.task('minifyCSS', function () {
    return gulp.src('./src/css/**/*.css') // Toma todos los archivos CSS dentro de /css
        .pipe(cleanCSS({ compatibility: 'ie8' })) // Minifica el CSS
        .pipe(gulp.dest('./public/css')); // Guarda en /public/css
});

// Tarea para observar cambios
gulp.task('watch', function () {
    gulp.watch('./src/js/**/*.js', gulp.series('minifyJS')); // Observa cambios en JS
    gulp.watch('./src/css/**/*.css', gulp.series('minifyCSS')); // Observa cambios en CSS
});

// Tarea por defecto
gulp.task('default', gulp.series('minifyJS', 'minifyCSS'));
