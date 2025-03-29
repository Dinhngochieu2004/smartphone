const OrderModel = require("../../models/order");
const ProductModel = require("../../models/product");
const CustomerModel = require("../../models/customer");
const transporter = require("../../../libs/transporter");
const pagination = require("../../../libs/pagination");
const ejs = require("ejs");
const path = require("path");

const OrderController = {
    index: async (req, res) => {
        try {
            const {id} = req.params;
            const query = {};
            query.customerId = id;
            const page = Number(req.query.page) ||1;
            const limit = Number(req.query.limit) ||10;
            const skip = page * limit - limit;
            const order = await OrderModel.find(query).sort({_id: -1}).skip(skip).limit(limit);
            return res.status(200).json({
                status:"successfully",
                data: order,
                page: await pagination(OrderModel, page, limit, query),
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    order: async (req, res) => {
        try {
            const { body } = req;
            const { customerId } = body;
            const {totalPrice} = body;
            const customer = await CustomerModel.findById(customerId);
            const prdIds = body.items.map((item)=>item.prd_id);
            const products = await ProductModel.find({_id: {$in: prdIds}});      
            const newItems = body.items.map((item)=>{
                const product = products.find((p)=> p._id.toString() === item.prd_id);
                return {
                    ...item,
                    name: product ? product.name: "Unknow Product",
                }
            });
            // const newBody = {
            //     ...body,
            //     items: newItems,
            // }
            // insert DB
            await new OrderModel(body).save();
            // Send mail
            const mailTemplatePath = path.join(__dirname, "../../views/mail.ejs");
            const html = await ejs.renderFile(mailTemplatePath, {
                customer,
                newItems,
                totalPrice,
            });
            // console.log("Customer:", customer);
            // console.log("New Items:", newItems);
            // console.log("Total Price:", totalPrice);
            await transporter.sendMail({
                from: '"Smartphone Store 👻" <smartphone@gmail.com>', // địa chỉ người gửi
                to: customer.email, // danh sách người nhận
                subject: "Xác nhận đơn hàng từ Smartphone Store ✔", // tiêu đề
                html, // nội dung html
            });
            return res.status(200).json({
                status:" success",
                messages:"Order successfully"
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    show:async(req,res)=>{
        try {
            const {id}= req.params;
            const order = await OrderModel.findById(id);
            return res.status(200).json({
                status: "successfully",
                data: order,
            })
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    cancelled:async(req,res)=>{
        try {
            const {id} = req.params;
            await OrderModel.updateOne({_id:id},{$set:{ status: "cancelled"}});
            return res.status(200).json({
                status:"successfully",
                messages:"Order cancelled successfully",
            })
        } catch (error) {
            return res.status(500).json(error);
        }
    }
};

module.exports = OrderController;
