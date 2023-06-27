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


// Update user diff.
exports.updateDiff = updateUserDiff;

function updateUserDiff(userDiff, cb) {
    merge();

    function merge() {
        users.get(userDiff._id, errors.wrapNano(function (err, user) {
            if (err) {
                cb(err);
            } else {
                extend(user, userDiff);
                schemas.validate(user, 'user', function (err) {
                    if (err) {
                        cb(err);
                    } else {
                        users.insert(user, errors.wrapNano(done));
                    }
                })
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
