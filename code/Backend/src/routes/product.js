const express = require('express');
const router = express.Router();
const productController = require("../controllers/product");
const upload = require("../middlewares/imageUpload");
const fileUpload = require("../middlewares/fileUpload");

const validate = require("../middlewares/validate");
const { authenticate } = require("../middlewares/authentication");
const { addProductValidation, updateProductValidation } = require("../validations/products.validation")

router.route('/')
    .post(authenticate, upload.multiImageUpload("images"), validate(addProductValidation), productController.addProduct)
    .get(authenticate, productController.getAllProduct);
    


router.route('/:id')    
    .patch(authenticate, upload.multiImageUpload("images"), validate(updateProductValidation), productController.updateProduct)
// File upload route


router.post('/:id/upload-file', authenticate, fileUpload.singleFileUpload('file'), productController.uploadFile);

router.post('/:id/upload-images', authenticate,
    upload.multiImageUpload('images'), 
    productController.uploadImages);
module.exports = router;