const Product = require("../models/productModel");
const ErrorHandler = require('../utils/errorHandling');
const catchAsyncError = require("../middlewares/catchAsyncError");
const APIFeatures = require('../utils/apiFeatures');


//Get All product
exports.getProducts = async (req, res, next) => {
    const resultPerPage = 2;
    const apiFeatures = new APIFeatures(Product.find(),req.query).serach().filter().paginate(resultPerPage);
    const totalProducts = await Product.find();
    const products = await apiFeatures.query;
    res.status(200).json({
        success: true,
        totalProducts:totalProducts.length,
        count:products.length,
        products,
        message: "products"
    })
};


//Create product
exports.newProduct = catchAsyncError(async (req, res, next) => {
    
    req.body.user = req.user.id
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product,
        message: "Product created Succkessfully"
    })
});


//Get single product
exports.getSingleProducts = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler('product not found', 404))
    }

    res.status(201).json({
        success: true,
        product: product,
        message: "Product fetched successfully"
    })
});


//update single product
exports.uppdateProducts = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler('product not found', 404))
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })

    res.status(201).json({
        success: true,
        product: product,
        message: "Product updated successfully"
    })
});


//Delete single product
exports.deleteProducts = catchAsyncError(async (req, res, next) => {

    const product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler('product not found', 404))
    }

    await product.deleteOne({});

    res.status(201).json({
        success: true,
        message: "Product deleted successfully"
    })
});