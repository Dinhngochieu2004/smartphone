const ProductModel = require("../models/product");
const UserModel = require("../models/user");

const AdminController = {
    index: async (req, res) => {
        try {
            const products = await ProductModel.find().countDocuments();
            const users = await UserModel.find().countDocuments();
            return res.status(200).json({
                status: "success",
                data: { users, products },
            });
        } catch (error) {
            return res.status(400).json(error);
        }
    },
};

module.exports = AdminController;