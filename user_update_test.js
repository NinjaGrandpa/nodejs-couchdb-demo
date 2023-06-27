const users = require("./db/users");

// 1-fce67ce0286a6e6f08793dace491ec2a

let user = {
    _id: "johndoe@example.com",
    _rev: process.argv[2],
    username: "JohnDoe",
    email: "johndoe@example.com",
    access_token: "some access token"
};

users.update(user, function (error) {
    if (error) {
        console.log(error);
    } else {
        console.log("user updated");
    }
});
