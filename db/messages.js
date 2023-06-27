const extend = require("util")._extend;
const schemas = require("../schemas");
const errors = require("../errors");

const messages = require("./couchdb").use("messages");

// Create user
exports.create = schemas.validating("message", "create", createMessage);

function createMessage(message, cb) {
    message.createdAt = Date.now();
    messages.insert(message, errors.wrapNano(cb));
}