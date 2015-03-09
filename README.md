# [gulp-recipe](https://github.com/PGS-dev/gulp-recipe-loader)-browsersync-server [![Dependency Status][depstat-image]][depstat-url]
[![NPM][npm-image]][npm-url]

Local development and distribution testing server with all [browsersync](http://www.browsersync.io/) features. Provides global watch handler.

## Tasks
### serve
> deps: preServe

Run the whole development server stack, with browsersync with all its features as a server.

### serve:dist

Serve files from dist folder. **Note** that project needs to be built manually first.

### preServe
> deps: watch

Run all preServe hooks.

### watch
> deps: clean:temp

Run all watch hooks.

### clean:temp

Delete temp folder and its contents.

## Configuration
### Recipe specific
#### browserSync
> default: {}<br>
> type: object

Browsersync [config options](http://www.browsersync.io/docs/options/), shared between both dev and dist server.

#### browserSync.dev
> default: {port: config.ports.dev, server: {baseDir: [config.paths.tmp, config.paths.app]}}<br>
> type: object

Browsersync [config options](http://www.browsersync.io/docs/options/), specific for dev server. Merged with shared config.

#### browserSync.dist
> default: {port: config.ports.dist, server: {baseDir: config.paths.dist}}<br>
> type: object

Browsersync [config options](http://www.browsersync.io/docs/options/), specific for dist server. Merged with shared config.

#### browserSync.useHistoryApi
> dev specific: browserSync.dev.useHistoryApi<br>
> dist specific: browserSync.dist.useHistoryApi

Add history api handling middleware to selected environment.

### Sources
#### sources.devAssets
> mandatory

Files that will be watched for changes by browserSync. Typically should include all files that may be directly served.

> example config:
```javascript
sources.devAssets = [
    paths.app + 'bower_components/*/*.js',
    paths.app + 'bower_components/*/{dist,min,release}/*.{js,css}', // most of the generic bower modules
    sources.js, // include only when serving non-processed js files
    sources.css, // include only when serving non-processed css files
    { files: paths.tmp + '**/*', base: paths.tmp } // all processed files from temp directory
];
```

### Paths
#### paths.dist
> default: 'app/'

App folder path, part of default dev baseDir configuration.

#### paths.tmp
> default: 'tmp/'

Temp folder path, part of default dev baseDir configuration.

#### paths.dist
> default: 'dist/'

Dist folder path, part of default dist baseDir configuration.

### Ports
#### ports.dev
> default: 3000

Default port for browserSync server. Part of default dev port configuration.
Note: actual used port may be different, as browserSync performs a empty port scan.

#### ports.dist
> default: 3100

Default port for browserSync server. Part of default dev port configuration.
Note: actual used port may be different, as browserSync performs a empty port scan.

### Tasks
#### tasks.browserSyncServe
> alias: tasks.serve<br>
> default: 'watch'

_serve_ task name.

#### tasks.browserSyncServeDist
> alias: tasks.serveDist<br>
> default: 'serve:dist'

_serve:dist_ task name.

#### tasks.browserSyncPreServe
> alias: tasks.preServe<br>
> default: 'preServe'

_preServe_ task name.

#### tasks.browserSyncWatch
> alias: tasks.watch<br>
> default: 'watch'

_watch_ task name.

#### tasks.browserSyncCleanTemp
> alias: tasks.cleanTemp<br>
> default: 'clean:temp'

_clean:temp_ task name.

## Api
### Provided Hooks
#### watch

Runs all hooked watch tasks before serve and preServe.

#### preServe

Runs all hooked preServe tasks just before server start, after watchers.

[npm-url]: https://npmjs.org/package/gulp-recipe-browsersync-server
[npm-image]: https://nodei.co/npm/gulp-recipe-browsersync-server.png?downloads=true
[depstat-url]: https://david-dm.org/PGS-dev/gulp-recipe-browsersync-server
[depstat-image]: https://img.shields.io/david/PGS-dev/gulp-recipe-browsersync-server.svg?style=flat