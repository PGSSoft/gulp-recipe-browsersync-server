var paths = {};

module.exports = function ($, config) {
    var _ = $.lodash;

    $.utils.checkMandatory(config, ['sources.devAssets']);

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

    // preconfigure defaults that may be used in further config
    config = _.merge({
        ports: {
            dev: 3000,
            dist: 3100
        },
        paths: {
            app: 'app/',
            tmp: 'tmp/',
            dist: 'dist/'
        }
    }, config);

    config = $.lodash.merge({
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
                        middleware: devMiddleware
                    }
                },
                dist: {
                    port: config.ports.dist,
                    server: {
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
            }
        }, config);

    var plainBS = _.omit(_.clone(config.browserSync), 'dev', 'dist');
    config.browserSync.dev = _.merge(_.cloneDeep(plainBS), config.browserSync.dev);
    config.browserSync.dist = _.merge(_.cloneDeep(plainBS), config.browserSync.dist);

    // assign these arrays only when not set alternatively, to prevent merge
    if(!config.browserSync.dev.server.baseDir) {
        config.browserSync.dev.server.baseDir = [config.paths.tmp, config.paths.app];
    }

    if(!config.browserSync.dist.server.baseDir) {
        config.browserSync.dist.server.baseDir = [config.paths.dist];
    }

    if(!config.browserSync.dist.files) {
        config.browserSync.dist.files = [config.paths.dist];
    }

    return config;
};