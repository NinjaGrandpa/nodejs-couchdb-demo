const users = require("./db/users");

const user = {
    email: "johndoe@example.com",
    name: "John Doe",
    address: "1 Sesame Street"
};

users.create(user, function (err) {
    if (err) {
        throw err;
    } else {
        console.log("user inserted");
    }
});
