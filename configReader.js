var paths = {};

module.exports = function ($, config) {
    var _ = $.lodash;

    config.browserSync = config.browserSync || {};
    var middleware = [];
    if(config.browserSync.useHistoryApi) {
        middleware.push(function () { return $.connectHistoryApiFallback; }());
    }

    config = _.merge({
        ports: {
            dev: '3000',
            prod: '3100'
        }
    }, config);

    return $.lodash.merge({
        tasks: {
            browserSyncServe: 'serve',
            browserSyncServeProd: 'serve:prod',
            browserSyncPreServe: 'preServe',
            browserSyncWatch: 'watch',
            browserSyncCleanTemp: 'clean:temp'
        },
        browserSyncDev: {
            server: {
                port: config.ports.dev,
                baseDir: [config.paths.tmp, config.paths.app],
                middleware: middleware
            }
        }
    }, {
        tasks: {
            browserSyncServe: config.tasks.serve,
            browserSyncServeProd: config.tasks.serveProd,
            browserSyncPreServe: config.tasks.preServe,
            browserSyncWatch: config.tasks.watch,
            browserSyncCleanTemp: config.tasks.cleanTemp
        },
        browserSyncDev: config.browserSync,
        browserSyncProd: config.browserSync
    }, config);
};