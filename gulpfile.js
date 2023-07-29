/* eslint-disable no-undef */
const path = require("path");
const gulp = require("gulp");
const del = require("del");
const vinylPaths = require("vinyl-paths");
const shell = require("gulp-shell");
const console = require("tracer").console();

const nodemon = require("gulp-nodemon");

exports.server = function() {
  const stream = nodemon({
    script: "server/index.ts",
    ext: "html js ts css",
    args: ["--transpile-only"],
    ignore: [],
    watch: ["server"],
    legacyWatch: true
  });

  return stream
    .on("restart", function(e) {
      console.debug("restarted!", e);
    })
    .on("crash", function(e) {
      console.error("Application has crashed!", e);
      stream.emit("restart", 10); // restart the server in 10 seconds
    });
};


exports.clean = function() {
  return gulp.src(["dist"], { read: false, allowEmpty: true }).pipe(vinylPaths(del));
};

