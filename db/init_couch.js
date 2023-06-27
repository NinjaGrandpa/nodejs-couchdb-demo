const async = require("async");
const couch = require("./couchdb");
const views = require("../views");

var databases = ["users", "messages"];

module.exports = initCouch;

function initCouch(cb) {
    async.series([createDatabases, createViews], cb);
}

function createDatabases(cb) {
    async.each(databases, createDatabase, cb);
}

// Create views after we have made sure they exist
function createViews(cb) {
    views.populate(cb);
}

function createDatabase(db, cb) {
    couch.db.create(db, function (err) {
        if (err && err.statusCode == 412) {
            err = null;

        }
        cb(err);
    });
}
