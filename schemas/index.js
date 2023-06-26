const Joi = require("joi");
const Boom = require("boom");

let schemaNames = ['user'];
let schemas = {};

schemaNames.forEach(function (schemaName) {
    schemas[schemaName] = require("./" + schemaName);
});

exports.validate = validate;

function validate(doc, schema, cb) {
    if (typeof schema == "string") {
        schema = schemas[schema];
    }

    if (!schema) {
        cb(new Error("Unknow schema"));
    } else {
        Joi.validate(doc, schema, function (err, value) {
            if (err) {
                Boom.wrap(err, 400);
                cb(err);
            } else {
                cb(null, doc);
            }
        });
    }
};

exports.validating = function validating(schemaName, fn) {
    let schema = schemas[schemaName];
    if (!schema) {
        throw new Error("Unknow schema: " + schemaName);
    }

    return function (doc, cb) {
        validate(doc, schema, function (err, doc) {
            if (err) {
                cb(err)
            } else {
                fn.call(null, doc, cb);
            }
        });
    };
};
