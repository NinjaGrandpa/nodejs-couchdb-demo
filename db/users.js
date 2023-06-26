const schemas = require("../schemas");

const users = require("../couchdb").use("users");

exports.create = schemas.validating("user", createUser);

function createUser(user, cb) {
    users.insert(user, user.email, cb);
};