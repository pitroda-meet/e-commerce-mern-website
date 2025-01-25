const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`mongo db conected ${conn.connection.host}`.blue);
  } catch (error) {
    console.error(`eerror:${error}`.green);
    process.exit(1);
  }
};
module.exports = connectDb;
