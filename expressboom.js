module.exports = function (error, request, response, next) {
    response.set(err.output.headers);
    response.status(error.output.statusCode);
    response.json(error.output.payload);
};
