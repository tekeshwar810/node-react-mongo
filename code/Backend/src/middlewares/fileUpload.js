const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    'application/pdf',
    'text/csv',
    'application/vnd.ms-excel',
    'text/plain',
  ];
  const extAllowed = /\.(csv|pdf)$/i;
  if (allowed.includes(file.mimetype) || extAllowed.test(file.originalname)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and CSV are allowed.'));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

const singleFileUpload = (field) =>
  async (req, res, next) => {
    upload.single(field)(req, res, (error) => {
      if (error) {
        return res.status(400).send({ success: false, message: error.message || 'Failed to upload file.' });
      }
      next();
    });
  };

module.exports = { singleFileUpload };