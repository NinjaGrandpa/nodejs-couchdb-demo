var nano = require("nano");

module.exports = nano(
    process.env.COUCHDB_URL ||
    "http://admin:12345@127.0.0.1:5984");