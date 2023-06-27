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

// Messages for a given user
exports.getFor = getMessagesFor;

function getMessagesFor(user, page, maxPerPage, cb) {
    messages.view(
        "by_to_createdAt", "by_to_createdAt",
        {
            startkey: [user, Date.now()],
            endkey: [user, 0],
            descending: true,
            include_docs: true,
            limit: maxPerPage,
            skip: page * maxPerPage
        },
        errors.wrapNano(function (err, result) {
            if (err) {
                cb(err);
            } else {
                result = result.rows.map(function (row) {
                    return row.doc;
                });
                cb(null, result);
            }
        })
    );
}
