const connectDB = require("../config/db.config");
const User = require("./users");
const Token = require("./token");
const Product = require("./product");
const ProductImage = require("./product.image");

// Connect to the database
connectDB();

const db = {
    User,
    Token,
    Product,
    ProductImage,
};

module.exports = db;
