// Installation:
// npm install --save-dev gulp gulp-sass gulp-sourcemaps gulp-rename
const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");

const SRC = "./src/sass";
const path = {
    "all": `${SRC}/**/*.scss`,
    "dist": "./dist",
    "distMeta": "./dist/metadata",
    "source": `${SRC}/style.scss`
};

// ===================================================================
// Tasks definition
// ===================================================================
const sassTask = () => {
    const sassStyle = {
        "errLogToConsole": true,
        "outputStyle": "compressed"
    };
    const renameStyle = { "extname": ".min.css" };
    const sourcemapStyle = { "mapFile": (mapFilePath) => mapFilePath };

    let src = gulp.src(path.source);

    src = src.pipe(sourcemaps.init());

    // Convert .scss files to .css
    src = src.pipe(sass(sassStyle).on("error", sass.logError));

    // Add .min.css extension
    src = src.pipe(rename(renameStyle));

    // Add sourcemap info to file
    src = src.pipe(sourcemaps.write("", sourcemapStyle));

    // Put the file in this folder
    src.pipe(gulp.dest(path.dist));
};
const expandedTask = () => {
    const sassStyle = { "outputStyle": "expanded" };
    let src = gulp.src(path.source);

    src = src.pipe(sass(sassStyle));
    src.pipe(gulp.dest(path.distMeta));
};
const bootstrapTask = () => {
    const sassStyle = { "outputStyle": "expanded" };
    let src = gulp.src("./sass/vendor/bootstrap.scss");

    src = src.pipe(sass(sassStyle));
    src.pipe(gulp.dest(path.distMeta));
};
const watchTask = () => gulp.watch(path.all, ["sass"]);

// ===================================================================
// Tasks creation
// ===================================================================
gulp.task("sass", sassTask);
gulp.task("expanded", expandedTask);
gulp.task("bootstrap", bootstrapTask);
gulp.task("default", ["sass"]);

// The second parameter run tasks array first before watch.
gulp.task("watch", ["sass"], watchTask);
