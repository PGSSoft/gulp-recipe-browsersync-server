var paths = {};

module.exports = function ($, config) {
    var _ = $.lodash;

    $.utils.checkMandatory(config, ['sources.assets']);

    // extract shared browserSync config
    var rawBS = _.merge(_.omit(config.browserSync || {}, ['dev', 'dist']), {server: {}});
    config = $.lodash.merge({
        paths: {
            app: 'app/',
            tmp: 'tmp/',
            dist: 'dist/'
        },
        browserSync: {
            // apply shared as default
            dev: _.cloneDeep(rawBS),
            dist: _.cloneDeep(rawBS)
        },
        tasks: {
                browserSyncServe: 'serve',
                browserSyncServeDist: 'serve:dist',
                browserSyncPreServe: 'preServe',
                browserSyncWatch: 'watch',
                browserSyncCleanTemp: 'clean:temp'
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

    // assign these arrays only when not set alternatively, to prevent merge
    config.browserSync.dev.server.baseDir = config.browserSync.dev.server.baseDir || [config.paths.tmp, config.paths.app];
    config.browserSync.dist.server.baseDir = config.browserSync.dist.server.baseDir || [config.paths.dist];

    // add temp folder to watcher
    var tempFiles = config.paths.tmp + '**';
    // prepare only needed source globs, content and fs checking is not needed.
    var watchGlobs = _.chain([config.sources.build, config.sources.assets, tempFiles])
        .map($.utils.parseSources)
        .flatten()
        .filter(function (s) { return s.watch !== false; })
        .pluck('files')
        .value();

    config.browserSync.dev.files = _.union(_.filter([config.browserSync.dev.files]), watchGlobs);
    config.browserSync.dist.files = _.union(_.filter([config.browserSync.dist.files]), [config.paths.dist]);

    // remove original sources, so no unnecessary load is performed
    config.sources = undefined;
    return config;
};