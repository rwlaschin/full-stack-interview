const Routes = require("require-all")({
    dirname: __dirname,
    filter: /^((?!index).*)\.js$/,
});

module.exports = function(fastify, opts, next) {
    Object.keys(Routes).forEach(key => {
        Routes[key](fastify, opts, next);
    });
    next();
};
