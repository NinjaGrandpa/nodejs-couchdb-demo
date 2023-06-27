const async = require("async");
const equal = require("deep-equal");
const couch = require("../db/couchdb");

const databaseNames = ["messages"];

const views = {};

databaseNames.forEach(function (database) {
    views[database] = require("./" + database);
});

// Fetches each view for the designated database
exports.populate = function populate(cb) {
    async.each(databaseNames, populateDb, cb);
};

// Calls 'ensureView()' for each design document
function populateDb(dbName, cb) {
    const db = couch.use(dbName);
    const dbViews = views[dbName];

    async.eachSeries(Object.keys(dbViews), ensureView, cb);

    // Calls 'insertDesignDoc()' if the design document doesn't exist or need to be updated
    function ensureView(viewName, cb) {
        const view = dbViews[viewName];

        const designDocName = "_design/" + viewName;
        db.get(designDocName, function (err, designDoc) {
            if (err && err.statusCode == 404) {
                insertDesignDoc(null, cb);
            } else if (err) {
                cb(err);
            } else if (equal(designDoc.views[viewName], view)) {
                cb();
            } else {
                insertDesignDoc(designDoc, cb);
            }
        });

        // Creates or updates the design document, repeats if conflict
        function insertDesignDoc(designDoc, cb) {
            if (!designDoc) {
                designDoc = {
                    language: "javascript",
                    views: {}
                };
            }

            designDoc.views[viewName] = view;

            db.insert(designDoc, designDocName, function (err) {
                if (err && err.statusCode == 409) {
                    ensureView(viewName, cb);
                } else {
                    cb(err);
                }
            });
        }
    }
}