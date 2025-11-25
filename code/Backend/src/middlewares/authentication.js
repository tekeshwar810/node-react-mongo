const jwt = require('jsonwebtoken')
const { getUser } = require('../services/user')

const authenticate = async (req, res, next) => {
    try {
        const token = req.header("token");
        if (!token) return res.status(401).send({ success: false, message: 'Please authenticate' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await getUser({ id: decoded.id },['password'])
        
        if (!user) return res.status(401).send({ success: false, message: 'Please authenticate' });
        req.user = user.dataValues;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Please authenticate' });
    }
}
module.exports = { authenticate };
