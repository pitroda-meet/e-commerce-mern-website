const mongoose = require("mongoose");
const dotenv = require("dotenv");
const products = require("./data/product");
const users = require("./data/users");
const UserModel = require("./model/UserModel");
const OrderModel = require("./model/OrderModel");
const ProductModel = require("./model/ProductModel");
const connectDb = require("./confing/confing");
require("colors");

dotenv.config();
connectDb();

const importData = async () => {
  try {
    await OrderModel.deleteMany();
    await ProductModel.deleteMany();
    await UserModel.deleteMany();

    const createUser = await UserModel.insertMany(users);
    const adminUser = createUser[0]._id;

    const sampleData = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await ProductModel.insertMany(sampleData);
    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await OrderModel.deleteMany();
    await ProductModel.deleteMany();
    await UserModel.deleteMany();

    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
