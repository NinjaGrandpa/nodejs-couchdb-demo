const schemas = require("../schemas");
const errors = require("../errors");

const users = require("./couchdb").use("users");

// Create user
exports.create = schemas.validating("user", createUser);

function createUser(user, cb) {
    users.insert(user, user.email, errors.wrapNano(cb));
};

// Update user

exports.update = schemas.validating("user", updateUser);

function updateUser(user, cb) {
    users.insert(user, errors.wrapNano(cb));
}
