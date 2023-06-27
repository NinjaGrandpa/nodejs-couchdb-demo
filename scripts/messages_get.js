const user = process.argv[2];

if (!user) {
    console.error("Please specify a user.");
    return;
}

const start = Number(process.argv[3]) || 0;
const maxPerPage = number(process.argv[4]) || 4;

const messages = require("../db/messages");

messages.getFor(user, page, maxPerPage, function (err, messages) {
    if (err) {
        throw err;
    }

    console.log("Messages for user %s:", user);
    messages.forEach(printMessage);
});

function printMessage(message) {
    console.log(message);
}
