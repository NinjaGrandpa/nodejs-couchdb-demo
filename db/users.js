const schemas = require("../schemas");
const errors = require("../errors");

const users = require("../couchdb").use("users");

exports.create = schemas.validating("user", createUser);

function createUser(user, cb) {
    users.insert(user, user.email, errors.wrapNano(cb));
};