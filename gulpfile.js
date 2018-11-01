const gulp = require('gulp'),
  htmlmin = require('gulp-htmlmin'),
  watch = require('gulp-watch'),
  stylus = require('gulp-stylus'),
  prefixer = require('gulp-autoprefixer'),
  babel = require('gulp-babel'),
  uglify = require('gulp-uglify'),
  rigger = require('gulp-rigger'),
  cleancss = require('gulp-clean-css'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  imageminJpegRecompress = require('imagemin-jpeg-recompress'),
  del = require('del'),
  cheerio = require('gulp-cheerio'),
  browserSync = require('browser-sync'),
  plumber = require('gulp-plumber'),
  notify = require('gulp-notify'),
  reload = browserSync.reload;

const path = {
  build: {
    root: 'build/',
    js: 'build/js/',
    css: 'build/styles/',
    img: 'build/img/',
    svg: 'build/img/svg/',
    fonts: 'build/fonts/'
  },
  src: {
    html: 'src/*.html',
    js: 'src/js/main.js',
    libs: 'src/js/libs.js',
    style: 'src/styles/main.styl',
    img: 'src/img/*.*',
    favicons: 'src/img/favicons/*.*',
    svg: 'src/img/svg/*.svg',
    fonts: 'src/fonts/**/*.*',
    manifest: 'src/manifest.json',
    appleTouchIcon: 'src/apple-touch-icon.png'
  },
  watch: {
    html: 'src/**/*.html',
    js: ['src/js/main.js', 'src/blocks/**/*.js'],
    libs: 'src/js/libs.js',
    style: ['src/styles/*.styl', 'src/blocks/**/*.styl'],
    img: 'src/img/*.*',
    svg: 'src/img/svg/*.svg',
    fonts: 'src/fonts/**/*.*',
    manifest: 'src/manifest.json'
  },
  clean: './build'
};

//Сборка html
gulp.task('html:dev', () => {
  console.log('HTML')
  gulp.src(path.src.html)
    .pipe(rigger())
    .pipe(gulp.dest(path.build.root))
    .pipe(reload({stream: true}));
});

gulp.task('html:prod', () => {
  console.log('HTML')
  gulp.src(path.src.html)
    .pipe(rigger())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(path.build.root))
    .pipe(reload({stream: true}));
});

//Сборка js
gulp.task('js:dev', () => {
  console.log('JS')
  gulp.src(path.src.js)
    .pipe(rigger())
    .pipe(babel({presets: ['@babel/env']}))
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));
});

gulp.task('js:prod', () => {
  console.log('JS')
  gulp.src(path.src.js)
    .pipe(rigger())
    .pipe(babel({presets: ['@babel/env']}))
    .pipe(uglify())
    .pipe(gulp.dest(path.build.js))
});

//Сборка JS библиотек
gulp.task('libs:dev', () => {
  console.log('JS LIBS')
  gulp.src(path.src.libs)
    .pipe(rigger())
    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.reload({ stream: true, once: true }));
 });
 
gulp.task('libs:prod', () => {
  console.log('JS LIBS')
  gulp.src(path.src.libs)
    .pipe(rigger())
    .pipe(uglify())
    .pipe(gulp.dest(path.build.js))
  });

//Сборка css
gulp.task('css:dev', function () {
  console.log('CSS')
  gulp.src(path.src.style)
  .pipe(plumber())
  .pipe(stylus({
    'include css': true
  }))
  .on("error", notify.onError(function(error) {
    return "Message to the notifier: " + error.message;
  }))
  .pipe(prefixer())
  .pipe(gulp.dest(path.build.css))
  .pipe(reload({stream: true}));
});

gulp.task('css:prod', () => {
  console.log('CSS')
  gulp.src(path.src.style)
    .pipe(plumber())
    .pipe(stylus({
      'include css': true
      })
    )
    .on("error", notify.onError(function(error) {
      return "Message to the notifier: " + error.message;
    }))
    .pipe(prefixer())
    .pipe(cleancss())
    .pipe(gulp.dest(path.build.css))
});

//Сборка картинок
gulp.task('images:prod', () => {
  console.log('IMAGES')
  gulp.src(path.src.img)
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imageminJpegRecompress({
        progressive: true,
        max: 80,
        min: 70
      }),
      pngquant({quality: '75-85'})
    ]))
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({stream: true}))
  gulp.src(path.src.appleTouchIcon)
    .pipe(gulp.dest(path.build.root))
    .pipe(reload({stream: true}))
});

//favicons
gulp.task('favicons:prod', () => {
  console.log('FAVICONS')
  gulp.src(path.src.favicons)
    .pipe(gulp.dest(path.build.root))
});

//svg
gulp.task('svg:prod', function() {
  console.log('SVG')
  gulp.src(path.src.svg)
    .pipe(cheerio({
      run: function($) {
        $('[width]').removeAttr('width');
        $('[height]').removeAttr('height');
      }
    }))
    .pipe(gulp.dest(path.build.svg))
    .pipe(reload({stream: true}));
});

//Сборка шрифтов
gulp.task('fonts:prod', () =>{
  console.log('FONTS')
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
});

//Манифест
gulp.task('manifest:copy', function() {
  console.log('MANIFEST')
  gulp.src(path.src.manifest)
    .pipe(gulp.dest(path.build.root))
});

//webserver
gulp.task('webserver', () => {
  console.log('SERVER')
  browserSync({
    server: {
      baseDir: "./build"
    },
    host: 'localhost',
    port: 3000,
    browser: ""
  });
});

//clean
gulp.task('clean', () => {
  console.log('CLEAN')
  return del(path.clean, {force:true});
});

//watch
gulp.task('watch', () => {
  watch([path.watch.html], () => {
    gulp.start('html:prod');
  });
  watch(path.watch.style, () => {
    gulp.start('css:dev');
  });
  watch(path.watch.js, () => {
    gulp.start('js:dev');
  });
  watch([path.watch.libs], () => {
    gulp.start('libs:dev');
  });
  watch([path.watch.img], () => {
    gulp.start('images:prod');
  });
  watch([path.watch.svg], () => {
    gulp.start('svg:prod');
  });
  watch([path.watch.fonts], () => {
    gulp.start('fonts:prod');
  });
  watch([path.watch.manifest], () => {
    gulp.start('manifest:copy');
  });
});

//gulp dev
gulp.task('dev', [
  'html:dev',
  'js:dev',
  'libs:dev',
  'css:dev',
  'fonts:prod',
  'manifest:copy',
  'images:prod',
  'svg:prod',
  'favicons:prod',
  'webserver',
  'watch'
]);



//gulp prod
gulp.task('prod', [
  'html:prod',
  'js:prod',
  'libs:prod',
  'css:prod',
  'fonts:prod',
  'images:prod',
  'svg:prod',
  'manifest:copy',
  'favicons:prod'
]);

gulp.task('default', ['clean'], () => {
  gulp.start('dev')
})

gulp.task('build', ['clean'], () => {
  gulp.start('prod')
})