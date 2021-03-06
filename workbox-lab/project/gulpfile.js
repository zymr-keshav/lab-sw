/*jshint esversion:6*/
/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const wbBuild = require('workbox-build');
const gulp = require('gulp');
const browserSync = require('browser-sync');
const del = require('del');
const runSequence = require('run-sequence');

// Clean output directory
gulp.task('clean', () => del(['.tmp', 'build/*', '!build/.git'], {dot: true}));

gulp.task('copy', () =>
  gulp.src([
    'app/**/*',
    'node_modules/workbox-sw/build/importScripts/workbox-sw.prod*.js'
  ]).pipe(gulp.dest('build'))
);

gulp.task('bundle-sw', () => {
  return wbBuild.injectManifest({
    swSrc: 'app/service-worker.js',
    swDest: 'build/service-worker.js',
    globDirectory: 'app',
    staticFileGlobs: [
      'index.html',
      'css/main.css'
    ]
  })
  .catch((err) => {
    console.log('[ERROR] This happened: ' + err);
  });
});

gulp.task('default', ['clean'], cb => {
  runSequence(
    'copy',
    'bundle-sw',
    cb
  );
});

gulp.task('serve', ['default'], () => {
  browserSync.init({
    server: 'build',
    port: 8002
  });
  gulp.watch('app/*', ['default']).on('change', browserSync.reload);
});


