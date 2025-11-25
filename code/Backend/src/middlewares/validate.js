const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
        const errStack = error.details.map((err) => err.message)
        return res.status(422).json({ success: false, message: errStack[0] });
    }
    return next();
};

module.exports = validate;