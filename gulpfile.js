/*jshint esversion: 6 */
const projectFolder = require("path").basename(__dirname);
const sourceFolder = "src";

const fs = require("fs");

const path = {
  build: {
      html: projectFolder + "/",
      css: projectFolder + "/css/",
      js: projectFolder + "/js/",
      img: projectFolder + "/img/",
      fonts: projectFolder + "/fonts/",
      php: projectFolder + "/"
  },
  src: {
      html: [sourceFolder + "/*.html", "!" + sourceFolder + "/_*html"],
      css: sourceFolder + "/scss/style.scss",
      js: sourceFolder + "/js/index.js",
      img: sourceFolder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
      fonts: sourceFolder + "/fonts/*.ttf",
      php: sourceFolder + "/*.php"
  },
  watch: {
      html: sourceFolder + "/**/*.html",
      css: sourceFolder + "/scss/**/*.scss",
      js: sourceFolder + "/js/**/*.js",
      img: sourceFolder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
      php: sourceFolder + "/**/*.php"
  },
  clean: "./" + projectFolder + "/"
};

// File where the favicon markups are stored
const FAVICON_DATA_FILE = 'faviconData.json';

const { src, dest, tree } = require("gulp"),
  gulp = require("gulp"),
  browsersync = require("browser-sync").create(),
  fileinclude = require("gulp-file-include"),
  del = require("del"),
  scss = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer"),
  groupMedia = require("gulp-group-css-media-queries"),
  cleanCss = require("gulp-clean-css"),
  rename = require("gulp-rename"),
  uglify = require("gulp-uglify-es").default,
  babel = require("gulp-babel"),
  imagemin = require('gulp-imagemin'),
  webp = require("gulp-webp"),
  webphtml = require("gulp-webp-html"),
  webpcss = require("gulp-webpcss"),
  svgSprite = require("gulp-svg-sprite"),
  ttf2woff = require("gulp-ttf2woff"),
  ttf2woff2 = require("gulp-ttf2woff2"),
  fonter = require("gulp-fonter"),
  realFavicon = require('gulp-real-favicon'),
  sourcemaps = require('gulp-sourcemaps');




  
function browserSync() {
  browsersync.init({
      server: {
          baseDir: "./" + projectFolder + "/",
      },
      port: 3000,
      notify: false
  });
  // browsersync.init({
  //   proxy: "gulp_byvik.dev/index.php"
  // });
}

function html() {
      src(path.src.html)
      .pipe(fileinclude())
      .pipe(webphtml())
      .pipe(dest(path.build.html));
    return src(path.src.php)
      .pipe(fileinclude())
      .pipe(webphtml())
      .pipe(dest(path.build.php))
      .pipe(browsersync.stream());
}

// function php() {
//      src(path.src.php)
//     .pipe(fileinclude())
//     .pipe(webphtml())
//     .pipe(dest(path.build.php));
//   return src(path.src.html)
//     .pipe(fileinclude())
//     .pipe(webphtml())
//     .pipe(dest(path.build.html))
//     .pipe(browsersync.stream());
// }




function css() {
  return src(path.src.css)
    .pipe(sourcemaps.init())
    .pipe(
      scss({
        outputStyle: "expanded",
      })
    )
    .pipe(groupMedia())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 5 versions"],
        cascade: true,
      })
    )
    .pipe(webpcss())
    .pipe(dest(path.build.css))
    .pipe(cleanCss())
    .pipe(
      rename({
        extname: ".min.css",
      })
    )
    .pipe(sourcemaps.write("./", {
      mapFile: function (mapFilePath) {
        // source map files are named *.map instead of *.js.map
        return mapFilePath.replace('.css.map', '.css.map');
      }
    }))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

function js() {
  return src(path.src.js)
    .pipe(sourcemaps.init())
    .pipe(fileinclude())
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(
      rename({
        extname: ".min.js",
      })
    )
    .pipe(dest(path.build.js))
    .pipe(sourcemaps.write("./", {
      mapFile: function (mapFilePath) {
        // source map files are named *.map instead of *.js.map
        return mapFilePath.replace('.js.map', '.js.map');
      }
    }))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}

function images() {
  return src([path.src.img, '!src/img/favicon/*'])
    .pipe(
      webp({
        quality:70
      })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
}

function fonts(){
  src(path.src.fonts)
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts));
  return src(path.src.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts));
}

function fontsStyle(params) {
  const fileContent = fs.readFileSync(sourceFolder + "/scss/fonts.scss");
  if (fileContent == "") {
    fs.writeFile(sourceFolder + "/scss/fonts.scss", "", cb);
    return fs.readdir(path.build.fonts, function (err, items) {
      if (items) {
        let cFontname;
        for (var i = 0; i < items.length; i++) {
          let fontname = items[i].split(".");
          fontname = fontname[0];
          if (cFontname != fontname) {
            fs.appendFile(
              sourceFolder + "/scss/fonts.scss",
              '@include font("' +
                fontname +
                '", "' +
                fontname +
                '", "400", "normal");\r\n',
              cb
            );
          }
          cFontname = fontname;
        }
      }
    });
  }
}

function cb() {}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
    // gulp.watch([path.watch.php], php);
}

function clean() {
    return del(path.clean);
}

gulp.task("svgSprite", function () {
  return gulp
    .src([sourceFolder + "/iconsprite/*.svg"])
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: "../icons/icons.svg",
            example: true,
          },
        },
      })
    )
    .pipe(dest(path.build.img));
});

gulp.task("otf2ttf", function () {
  return src([sourceFolder + "/fonts/*.otf"])
    .pipe(
      fonter({
        formats: ["ttf"],
      })
    )
    .pipe(dest(sourceFolder + "/fonts/"));
});
// *.{jpg,png,svg,gif,ico,webp}
// /img/favicon/
// Generate the icons. This task takes a few seconds to compconste.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task("generate-favicon", function (done) {
  realFavicon.generateFavicon(
    {
      masterPicture: sourceFolder + "/img/favicon/favicon.png",
      dest: sourceFolder + "/img/favicon/",
      iconsPath: "/",
      design: {
        ios: {
          pictureAspect: "noChange",
          assets: {
            ios6AndPriorIcons: false,
            ios7AndLaterIcons: false,
            precomposedIcons: false,
            declareOnlyDefaultIcon: true,
          },
        },
        desktopBrowser: {
          design: "raw",
        },
        windows: {
          pictureAspect: "noChange",
          backgroundColor: "#da532c",
          onConflict: "override",
          assets: {
            windows80Ie10Tile: false,
            windows10Ie11EdgeTiles: {
              small: false,
              medium: true,
              big: false,
              rectangle: false,
            },
          },
        },
        androidChrome: {
          pictureAspect: "noChange",
          themeColor: "#ffffff",
          manifest: {
            display: "standalone",
            orientation: "notSet",
            onConflict: "override",
            declared: true,
          },
          assets: {
            legacyIcon: false,
            lowResolutionIcons: false,
          },
        },
        safariPinnedTab: {
          pictureAspect: "silhouette",
          themeColor: "#5bbad5",
        },
      },
      settings: {
        scalingAlgorithm: "Mitchell",
        errorOnImageTooSmall: false,
        readmeFile: false,
        htmlCodeFile: false,
        usePathAsIs: false,
      },
      markupFile: FAVICON_DATA_FILE,
    },
    function () {
      done();
    }
  );
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task("check-for-favicon-update", function (done) {
  var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
  realFavicon.checkForUpdates(currentVersion, function (err) {
    if (err) {
      throw err;
    }
  });
});




const build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts), fontsStyle);
const watch = gulp.parallel(build, watchFiles, browserSync);

// exports.php = php;
exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build; 
exports.watch = watch;
exports.default = watch;