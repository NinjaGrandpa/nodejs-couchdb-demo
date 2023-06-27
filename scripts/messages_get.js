const user = process.argv[2];

if (!user) {
    console.error("Please specify a user.");
    return;
}

const start = Number(process.argv[3]) || Date.now();
const maxPerPage = Number(process.argv[4]) || 4;

const messages = require("../db/messages");

messages.countFor(user, function (err, count) {
    if (err) {
        throw err;
    }

    console.log('%s has a total of %d messages.', user, count);

    messages.getFor(user, start, maxPerPage, function (err, messages, next) {
        if (err) {
            throw err;
        }

        console.log("Messages for user %s:", user);
        messages.forEach(printMessage);

        console.log('\nNext message ID is %s', next);
    });

    function printMessage(message) {
        console.log(message);
    }
});
