const upload = require("../utils/multer");

const multiImageUpload = ((field,) =>
  async (req, res, next) => {
    upload.single(field)(req, res, async (error) => {
      if (error) {
        const message = error.message || 'Failed to upload image.';
        return res.status(400).send({ success: false, message });
      }
      next();
    });
  })

module.exports = { multiImageUpload };