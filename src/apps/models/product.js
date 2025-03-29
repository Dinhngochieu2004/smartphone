const mongoose = require("../../common/database")();

const productSchema = new mongoose.Schema({
    category_id:{
        type: mongoose.Types.ObjectId,
        // ref: "Categories",
        required: true,
    },
    name:{
        type: String,
        text: true,
        required: true,
    },
    image:{
        type: String,
        default: null,
    },
    price:{
        type: String,
        default: null,
    },
    status:{
        type: String,
        default: null,
    },
    accessories:{
        type: String,
        required: true,
    },
    promotion:{
        type: String,
        required: true,
    },
    details:{
        type: String,
        default: null,
    },
    is_stock:{
        type: Boolean,
        default: true,
    },
    is_featured:{
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const ProductModel = mongoose.model("Product", productSchema, "products");
module.exports = ProductModel;