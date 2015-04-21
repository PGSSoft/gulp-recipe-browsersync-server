'use strict';

module.exports = function ($, config) {
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
        $.browserSync(config.browserSync.dev);
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
        $.utils.runSubtasks($.utils.getHooks('preServe', $.recipes), cb);
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
        $.utils.runSubtasks($.utils.getHooks('watch', $.recipes), cb);
    }

    function browserSyncCompileTask(cb) {
        $.utils.runSubtasks($.utils.getHooks('compile', $.recipes), cb);
    }

    function browserSyncPostCompileTask(cb) {
        $.utils.runSubtasks($.utils.getHooks('postCompile', $.recipes), cb);
    }

    $.utils.maybeTask(config.tasks.browserSyncServeDist, browserSyncServeDistTask);
    $.utils.maybeTask(config.tasks.browserSyncServe, [config.tasks.browserSyncPreServe], browserSyncServeTask);
    $.utils.maybeTask(config.tasks.browserSyncCleanTemp, browserSyncCleanTempTask);
    $.utils.maybeTask(config.tasks.browserSyncCompile, [config.tasks.browserSyncCleanTemp], browserSyncCompileTask);
    $.utils.maybeTask(config.tasks.browserSyncPostCompile, [config.tasks.browserSyncCompile], browserSyncPostCompileTask);
    $.utils.maybeTask(config.tasks.browserSyncWatch, [config.tasks.browserSyncPostCompile], browserSyncWatchTask);
    $.utils.maybeTask(config.tasks.browserSyncPreServe, [config.tasks.browserSyncWatch], browserSyncPreServeTask);

    return {};
};