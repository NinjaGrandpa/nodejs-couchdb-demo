const Joi = require("@hapi/joi");
const Boom = require("boom");

const schemaNames = ['user'];
// const schemaNames = Joi.array().items(Joi.string().valid("user"));
const schemas = {};

schemaNames.forEach(function (schemaName) {
    schemas[schemaName] = require("./" + schemaName);
});

exports.validate = validate;

function validate(doc, schema, op, cb) {
    if (typeof schema == "string") {
        schema = schemas[schema];
    }

    if (!schema) {
        cb(new Error("Unknown schema"));
    } else {
        schema = schema[op];

        if (!schema) {
            throw new Error("Undefined op " + op);

        } else {
            Joi.validate(doc, schema, function (err, value) {
                if (err) {
                    const validationError = Boom.boomify(err, { statusCode: 400 });
                    cb(validationError);
                } else {
                    cb(null, doc);
                }
            });
        }
    }
};

exports.validating = function validating(schemaName, op, fn) {
    const schema = schemas[schemaName];
    if (!schema) {
        throw new Error("Unknown schema: " + schemaName);
    }

    return function (doc, cb) {
        validate(doc, schema, op, function (err, doc) {
            if (err) {
                cb(err);
            } else {
                fn.call(null, doc, cb);
            }
        });
    };
};
