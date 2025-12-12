import productModel from '../models/productModel.js';
import fs from 'fs';
import slugify from 'slugify';

export const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        // validation
        switch (true) {
            case !name:
                return res.status(500).send({
                    error: "Name is required"
                });
            case !description:
                return res.status(500).send({
                    error: "Description is required"
                });
            case !price:
                return res.status(500).send({
                    error: "Price is required"
                });
            case !category:
                return res.status(500).send({
                    error: "Category is required"
                });
            case !quantity:
                return res.status(500).send({
                    error: "Quantity is required"
                });
            case photo && photo.size > 1000000:
                return res.status(500).send({
                    error: "Photo is required and should be less then 1mb"
                });

        }


        const products = new productModel({
            ...req.fields, slug: slugify(name)
        });

        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }

        await products.save();
        res.status(201).send({
            success: true,
            message: "Product created successfully",
            products
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in creating product"
        });
    }
};

export const getProductController = async (req, res) => {
    try {

        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            message: "All products",
            total: products.length,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting products",
            error: error.message
        });
    }
};

export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug }).select("-photo").populate('category');

        res.status(200).send({
            success: true,
            message: "Single product fetched",
            product
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting single product",
            error
        });
    }
};