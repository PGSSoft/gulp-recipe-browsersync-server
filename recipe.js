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
    function browserSyncServeTask() {
        var devAssetPipe = $.utils.queuedLazypipe($.utils.getPipes('devAsset'));

        $.browserSync(_.merge(config.browserSync.dev, {
            files: _.union(sources.devAssets.globs, devAssetPipe.globs, sources.index.globs)
        }));
    }

    /**
     * Serve files from dist folder. **Note** that project needs to be built manually first.
     *
     * @task serve
     * @config tasks.browserSyncServe
     * @config tasks.serve
     * @deps preServe
     */
    function browserSyncServeDistTask() {
        console.log(config.browserSync.dist);
        $.browserSync(config.browserSync.dist);
    }

    /**
     * Clears config.paths.tmp
     *
     * @task clean:temp
     * @config tasks.browserSyncCleanTemp
     * @config tasks.cleanTemp
     */
    function browserSyncCleanTempTask(cb) {
        $.rimraf(config.paths.tmp, cb);
    }

    /**
     * Runs all published preServe tasks, just before actual serve takes place
     *
     * @task preServe
     * @config tasks.browserSyncPreServe
     * @config tasks.preServe
     * @deps watch
     */
    function browserSyncPreServeTask(cb) {
        var preServeHooks = _.chain($.recipes)
            .pluck('preServe')
            .filter()
            .flatten()
            .value();

        $.utils.runSubtasks(preServeHooks, cb);
    }

    /**
     * Starts all published watch tasks
     *
     * @task watch
     * @config tasks.browserSyncWatch
     * @config tasks.watch
     * @deps clean:temp
     */
    function browserSyncWatchTask(cb) {
        var watchHooks = _.chain($.recipes)
            .pluck('watch')
            .filter()
            .flatten()
            .value();

        $.utils.runSubtasks(watchHooks, cb);
    }

    $.utils.maybeTask(config.tasks.browserSyncServeDist, browserSyncServeDistTask);
    $.utils.maybeTask(config.tasks.browserSyncServe, [config.tasks.browserSyncPreServe], browserSyncServeTask);
    $.utils.maybeTask(config.tasks.browserSyncCleanTemp, browserSyncCleanTempTask);
    $.utils.maybeTask(config.tasks.browserSyncWatch, [config.tasks.browserSyncCleanTemp], browserSyncWatchTask);
    $.utils.maybeTask(config.tasks.browserSyncPreServe, [config.tasks.browserSyncWatch], browserSyncPreServeTask);

    return {};
};