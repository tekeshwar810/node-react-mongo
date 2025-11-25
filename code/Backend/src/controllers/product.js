const Product = require("../models/product");
const ProductImage = require("../models/product.image");
const { pagination } = require("../utils/pagination");

const addProduct = async (req, res) => {
    try {
        const files = req.files;
        if (files.length) {
            const product = new Product({
                ...req.body,
                user: req.user.id,
            });
            await product.save();

            const images = files.map((file) => ({
                image: file.filename,
                product: product._id,
            }));

            const productImages = await ProductImage.insertMany(images);
            return res.status(201).send({
                success: true,
                message: "Product added successfully.",
                data: { product, productImages },
            });
        } else {
            return res.status(400).send({ success: false, message: "Product image is required." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

const getAllProduct = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        const filter = { user: req.user.id };

        if (search) {
            filter.name = { $regex: search.trim(), $options: "i" };
        }

        const paginate = pagination(page, limit);
        const productCount = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .populate("user", "name email")
            .populate("productImages", "image")
            .sort({ _id: -1 })
            .skip(paginate.offset)
            .limit(paginate.pageSize);

        return res.status(200).send({
            success: true,
            message: "Products retrieved successfully.",
            data: { count: productCount, rows: products },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

const updateProduct = async (req, res) => {
    try {
        const updateProductData = req.body;
        const product = await Product.findByIdAndUpdate(req.params.id, updateProductData, {
            new: true,
        });
        return res.status(200).send({
            success: true,
            message: "Product updated successfully.",
            data: product,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};


const uploadFile = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'File is required and must be a CSV or PDF.' });
        const file = req.file;
        // const fileUrl = `http://${process.env.HOST}:${process.env.PORT}/${file.filename}`;
        const fileUrl = `/${file.filename}`;
        return res.status(201).json({ success: true, message: 'File uploaded successfully.', data: { file: { originalname: file.originalname, filename: file.filename, mimetype: file.mimetype, size: file.size }, url: fileUrl } });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error.' })
    }
}

const uploadImages = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'Image is required and must be jpeg , png' });
       const file = req.file;
       
        const fileUrl = `/${file.filename}`;
        return res.status(201).json({ success: true, message: 'Image uploaded successfully.', data: { file: { originalname: file.originalname, filename: file.filename, mimetype: file.mimetype, size: file.size }, url: fileUrl } });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error.' })
    }
}
module.exports = { addProduct, getAllProduct, updateProduct, uploadImages, uploadFile };