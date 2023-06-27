const schemas = require("../schemas");
const errors = require("../errors");
const diff = require("object-versions").diff;

const users = require("./couchdb").use("users");

// Create user
exports.create = schemas.validating("user", createUser);

function createUser(user, cb) {
    users.insert(user, user.email, errors.wrapNano(cb));
};

// Update user
exports.update = updateUser;

function updateUser(user, cb) {
    users.get(user._id, errors.wrapNano(function (err, currentuser) {
        if (err) {
            cb(err);
        } else {
            const userDiff = diff(currentuser, user);
            schemas.validate(userDiff, "user", "update", function (err) {
                if (err) {
                    cb(err);
                } else {
                    users.insert(user, errors.wrapNano(cb));
                }
            });
        }
    }));
}

// Update user diff
// accepts an incomplete document, containing only the attributes changed
exports.updateDiff = updateUserDiff;

function updateUserDiff(userDiff, cb) {
    schemas.validate(userDiff, "user", "update", function (err) {
        if (err) {
            cb(err);
        } else {
            merge();
        }
    });

    // Gets the latest version of the document
    // Applies the given changes
    // Tries to save it into CouchDb, if it doesn't work it will try again
    function merge() {
        users.get(userDiff._id, errors.wrapNano(function (err, user) {
            if (err) {
                cb(err);
            } else {
                extend(user, userDiff);
                users.insert(user, errors.wrapNano(done));
            }
        }));

        function done(err) {
            if (err && err.statusCode == 409 && !userDiff._rev) {
                merge(); // try again
            } else {
                cb.apply(null, arguments);
            }
        }
    }
}
