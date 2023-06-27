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

function getMessagesFor(user, cb) {
    messages.view(
        "by_to_createdAt", "by_to_createdAt",
        {
            startkeys: [user, 0],
            endkey: [user, Date.now()],
            include_docs: true
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

// Messages order by created date
exports.by_to_createdAt = {
    map: function (doc) {
        if (doc.to && doc.createdAt) {
            emit([doc.to, doc.createdAt], { _id: doc._id });
        }
    }
};
