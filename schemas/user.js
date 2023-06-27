const extend = require("util")._extend;
const Joi = require("@hapi/joi");

module.exports = Joi.object().keys({
    _rev: Joi.string(),
    _id: Joi.string(),
    email: Joi.string().email().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/),
    access_token: [Joi.string(), Joi.number()],
    birthyear: Joi
        .number()
        .integer()
        .min(1900)
        .max(
            (new Date())
                .getFullYear()
        ),
});


// Schema for updating users
const updatedAttributes = {
    _id: Joi.string(),
    _rev: Joi.string(),
    password: Joi.string().regex(/[a-zA-Zo-9]{3,30}/),
    access_token: [Joi.string(), Joi.number()],
    birthyear: Joi.number().integer().min(1900).max((new Date()).getFullYear())
};

exports.update = Joi.object().keys(updatedAttributes);

// Schema for inserting users, extends the updateAttributes
const createAttributes = extend({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email()
}, updatedAttributes);

exports.create = Joi.object().keys(createAttributes);