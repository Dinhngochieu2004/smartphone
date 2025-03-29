const mongoose = require("../../common/database")();
const orderSchema = new mongoose.Schema({
    customerId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"Customer",
    },
    totalPrice:{
        type: Number,
        required: true,
    },
    status: {
        type: String, //  shipping/delivered/cancelled
        default: "shipping",
    },
    items:[
        {
            prd_id:{
                type: mongoose.Types.ObjectId,
                required: true,
            },
            price:{
                type: String,
                required: true,
            },
            qty:{
                type: Number,
                required: true,
            },
        }
    ],
},{timestamps: true});
const OrderModel = mongoose.model("Orders", orderSchema,"orders");
module.exports = OrderModel;