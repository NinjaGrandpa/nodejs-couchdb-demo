const Boom = require("boom");

exports.wrapNano = function wrapNanoErro(cb) {
    return function (err) {
        if (err) {
            Boom.wrap(err, err.statusCode || 500);
        }
        cb.apply(null, arguments);
    };
}
