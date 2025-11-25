// multerConfig.js
const multer = require("multer");
const path = require("path");
// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname,  "../uploads/")); // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Set the file name
  },
});

// Define file filter function
const fileFilter = (req, file, cb) => {
  // Check if the file type is allowed
  const allowedFileTypes = ["image/jpeg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(null, false); // Reject the file
    cb(new Error("Invalid file type. Only JPEG and PNG are allowed."));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
module.exports = upload;
