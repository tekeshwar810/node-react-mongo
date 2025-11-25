const { getUser, createUser, generateToken } = require("../services/user");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
    try {
        const user = await getUser({
            $or: [
                { username: req.body.username },
                { email: req.body.email },
            ],
        });

        if (user) {
            res.status(400).json({ success: false, message: "Email or Username already exist." });
        } else {
            const userData = await createUser(req.body);
            res.status(201).json({
                success: true,
                message: "User signup successfully.",
                data: { id: userData._id, name: userData.name, email: userData.email },
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

const login = async (req, res) => {
    try {
        const user = await getUser({ email: req.body.email });
        if (!user) {
            res.status(400).json({ success: false, message: "Invalid Email or Password." });
        } else if (!(await bcrypt.compare(req.body.password, user.password))) {
            res.status(400).json({ success: false, message: "Invalid Email or Password." });
        } else {
            const token = await generateToken(user._id);
            const userData = {
                token,
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
            };
            res.status(200).json({ success: true, message: "User logged in successfully.", data: userData });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

module.exports = { signup, login };