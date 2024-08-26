const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"],
        maxLength: [100, 'product name cannot exceed 100 character']
    },
    price: {
        type: Number,
        required: true,
        default: 0.0,
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            image: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "please enter product category"],
        enum: {
            values: [
                "Electronics",
                "Mobile Phones",
                "Laptops", 
                "Accessories",
                "Headphones",
                "Food",
                "Books",
                "Clothes/Shoes",
                "Beaauty/Health",
                "Sports",
                "Outdoors",
                "Home"
            ],
            message : "please select category"
        }
    },
    seller:{
        type:String,
        required:[true,"please enter seller details"]
    },
    stock:{
        type:Number,
        required:[true,"please enter product stock"],
        max:[20,"Product stock cannot exceed 20"]
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true
            },
            rating:{
                type:String,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.Types.ObjectId
    },
    createdAt:{
        type:Date,
        default:new Date
    }
})

const productModel = mongoose.model("Product",productSchema);

module.exports = productModel;