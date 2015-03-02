'use strict';

module.exports = function ($, config, sources) {
    var _ = $.lodash;

    /**
     * use browserSyncDev to configure browsersync dev server
     * use browserSync configure browsersync servers
     *
     * @task serve
     * @config tasks.browserSyncServe
     * @config tasks.serve
     * @deps preServe
     */
    $.gulp.task(config.tasks.browserSyncServe, [config.tasks.browserSyncPreServe], function () {
        var middleware = [];

        $.browserSync(_.merge(config.browserSyncDev, {
            files: sources.devAssets.globs
        }));
    });

    /**
     * Clears config.paths.tmp
     *
     * @task clean:temp
     * @config tasks.browserSyncCleanTemp
     * @config tasks.cleanTemp
     */
    $.gulp.task(config.tasks.browserSyncCleanTemp, function (cb) {
        $.rimraf(config.paths.tmp, cb);
    });

    /**
     * Runs all published preServe tasks, just before actual serve takes place
     *
     * @task preServe
     * @config tasks.browserSyncPreServe
     * @config tasks.preServe
     * @deps watch
     */
    $.gulp.task(config.tasks.browserSyncPreServe, [config.tasks.browserSyncWatch], function (cb) {
        var preServeHooks = _.chain($.recipes)
            .pluck('preServe')
            .filter()
            .flatten()
            .value();

        $.utils.runSubtasks(preServeHooks, cb);
    });

    /**
     * Starts all published watch tasks
     *
     * @task watch
     * @config tasks.browserSyncWatch
     * @config tasks.watch
     * @deps clean:temp
     */
    $.gulp.task(config.tasks.browserSyncWatch, [config.tasks.browserSyncCleanTemp], function (cb) {
        var watchHooks = _.chain($.recipes)
            .pluck('watch')
            .filter()
            .flatten()
            .value();

        $.utils.runSubtasks(watchHooks, cb);
    });

    return {};
};