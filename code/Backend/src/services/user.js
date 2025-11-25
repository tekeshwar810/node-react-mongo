const User = require("../models/users");
const Token = require("../models/token");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

/**
 * 
 * @param {Object} filter 
 * @returns {Promise}
 */
const getUser = async (filter) => {
    return await User.findOne(filter).select("-password").lean();
};

/**
 * 
 * @param {Object} userData 
 * @returns {Promise<user>}
 */
const createUser = async (userData) => {
    const salt = bcrypt.genSaltSync(10);
    const encryptedPassword = await bcrypt.hash(userData.password, salt);
    const user = new User({ ...userData, password: encryptedPassword });
    return await user.save();
};

/**
 * 
 * @param {String} userId 
 * @returns {String} 
 */
const generateToken = async (userId) => {
    const token = JWT.sign({ id: userId }, process.env.JWT_SECRET_KEY, { expiresIn: "2h" });
    const tokenDoc = new Token({ user: userId, token });
    await tokenDoc.save();
    return token;
};

module.exports = { getUser, createUser, generateToken };