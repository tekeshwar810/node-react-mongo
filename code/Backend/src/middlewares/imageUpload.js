const upload = require("../utils/multer");

const multiImageUpload = ((field,) =>
  async (req, res, next) => {
    upload.array(field)(req, res, async (error) => {
      if (error) {
        return res.status(400).send({ success: false, message: 'Failed to upload image.' });
      }
        next();
    });
  })

module.exports = { multiImageUpload };