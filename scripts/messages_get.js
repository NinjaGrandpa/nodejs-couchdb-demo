const user = process.argv[2];

if (!user) {
    console.error("Please specify a user.");
    return;
}

const messages = require("../db/messages");

messages.getFor(user, function (err, messages) {
    if (err) {
        throw err;
    }

    console.log("Messages for user %s:", user);
    messages.forEach(printMessage);
});

function printMessage(message) {
    console.log(message);
}