const extend = require("util")._extend;
const messages = require("../db/messages");

const message = {
    from: "glenn@glennsson.se",
    to: "johndoe@example.com",
    subject: "Test 123",
    body: "Test message body"
};

let count = 10;
let left = count;

for (var i = 1; i <= count; i++) {
    messages.create(message, created);
}

function created(err) {
    if (err) {
        throw err;
    }
    if (--left == 0) {
        console.log('%d messages inserted', count);
    }
}
