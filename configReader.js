var paths = {};

module.exports = function ($, config) {
    var _ = $.lodash;

    // configure middleware
    var lazyHistoryApi = _.once(function lazyHistoryApi() {
        return $.connectHistoryApiFallback;
    });

    config.browserSync = _.merge(config.browserSync || {}, {dev: {}, dist: {}});
    var devMiddleware = [], distMiddleware = [];
    if (config.browserSync.useHistoryApi || config.browserSync.dev.useHistoryApi) {
        devMiddleware.push(lazyHistoryApi());
    }
    if (config.browserSync.useHistoryApi || config.browserSync.dist.useHistoryApi) {
        distMiddleware.push(lazyHistoryApi());
    }

    config = _.merge({
        ports: {
            dev: '3000',
            dist: '3100'
        }
    }, config);


    var plainBS = _.omit(config.browserSync, 'dev', 'dist');
    return $.lodash.merge({
            tasks: {
                browserSyncServe: 'serve',
                browserSyncServeDist: 'serve:dist',
                browserSyncPreServe: 'preServe',
                browserSyncWatch: 'watch',
                browserSyncCleanTemp: 'clean:temp'
            },
            browserSync: {
                dev: {
                    port: config.ports.dev,
                    server: {
                        baseDir: [config.paths.tmp, config.paths.app],
                        middleware: devMiddleware
                    }
                },
                dist: {
                    port: config.ports.dist,
                    server: {
                        baseDir: [config.paths.dist],
                        middleware: distMiddleware
                    }
                }
            }
        }, {
            tasks: {
                browserSyncServe: config.tasks.serve,
                browserSyncServeDist: config.tasks.serveDist,
                browserSyncPreServe: config.tasks.preServe,
                browserSyncWatch: config.tasks.watch,
                browserSyncCleanTemp: config.tasks.cleanTemp
            },
            browserSync: {
                dev: plainBS,
                dist: plainBS
            }
        }, config);
};