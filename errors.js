const Boom = require("boom");

exports.wrapNano = function wrapNanoErro(cb) {
    return function (err) {
        if (err) {
            // Boom.wrap(err, err.statusCode || 500);

            Boom.boomify(err, {statusCode: err.statusCode});
        }
        cb.apply(null, arguments);
    };
}
