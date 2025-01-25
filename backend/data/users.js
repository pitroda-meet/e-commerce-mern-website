const bcrypt = require("bcryptjs");

const User = [
  {
    name: "admin",
    email: "admin@admin.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "meet",
    email: "meet@meet.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "user",
    email: "user@user.com",
    password: bcrypt.hashSync("123456", 10),
  },
];
module.exports = User;
