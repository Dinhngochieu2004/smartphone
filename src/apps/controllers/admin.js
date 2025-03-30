const ProductModel = require("../models/product");
const CategoryModel = require("../models/category"); // Import mô hình CategoryModel
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
    addCategory: async (req, res) => {
        try {
            const { name} = req.body; 
            if (!name) {
                return res.status(400).json({ status: "error", message: "Category name is required" });
            }

            // Tạo danh mục mới
            const newCategory = new CategoryModel({ name });
            await newCategory.save();

            return res.status(201).json({
                status: "success",
                message: "Category added successfully",
            });
        } catch (error) {
            return res.status(500).json({ status: "error", message: "Internal server error", error });
        }
    },
    updateCategories: async (req, res) => {
        try {
        const { id } = req.params;
        const {body} =req;
        const category = {
            name: body.name
        }; 
        const updateCategory = await CategoryModel.findOne({ name: body.name });
        if (updateCategory) {
            return res.status(400).json("danh muc khong ton tai")
        }
        await CategoryModel.updateOne({_id: id}, {$set: category});
        return res.status(200).json({
            status:" success",
            message:"Category updated successfully",
        })
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    deleteCategories:async(req,res)=>{
        try {
            const {id} = req.params;
            await CategoryModel.deleteOne({_id: id});
            return res.status(200).json({
                status:"success",
                message:"categories delete successfully"
            })
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    listProducts: async (req, res) => {
        try {
            const page = Number(req.query.page) || 1; 
            const limit = Number(req.query.limit) || 10; 
            const skip = page*limit- limit;

            // Lấy danh sách sản phẩm với phân trang
            const products = await ProductModel.find()
                .sort({ _id: -1 }) // Sắp xếp giảm dần theo _id
                .skip(skip)
                .limit(limit);

            // Tổng số sản phẩm
            const totalRows = await ProductModel.countDocuments();
            const totalPages = Math.ceil(totalRows / limit); // Tổng số trang

            return res.status(200).json({
                status: "success",
                data: {
                    products,
                    pagination: {
                        currentPage: page,
                        totalPages,
                        totalRows,
                        limit,
                    },
                },
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    createProducts: async (req, res) => {
        try {
            const { name, price ,status,category_id,details,promotion,accessories } = req.body;
            // Kiểm tra xem danh mục có tồn tại không
            const existingCategory = await CategoryModel.findById(category_id);
            if (!existingCategory) {
                return res.status(404).json({
                    status: "error",
                    message: "Category not found",
                });
            }

            // Tạo sản phẩm mới
            const newProduct = new ProductModel({
                name,
                price,
                status,
                category_id,
                details,
                promotion,
                accessories,
            });

            // Lưu sản phẩm vào cơ sở dữ liệu
            await newProduct.save();

            return res.status(200).json({
                status: "success",
                message: "Product created successfully",
                //data: newProduct,
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    updateProducts: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, price, status, details, promotion, accessories } = req.body;
            // Kiểm tra xem sản phẩm có tồn tại không
            const existingProduct = await ProductModel.findById(id);
            if (!existingProduct) {
                return res.status(404).json({
                    status: "error",
                    message: "Product not found",
                });
            }
            // Cập nhật sản phẩm (không cập nhật category_id)
            const updatedProduct = {
                name,
                price,
                status,
                details,
                promotion,
                accessories,
            };
            await ProductModel.updateOne({ _id: id }, { $set: updatedProduct });
            return res.status(200).json({
                status: "success",
                message: "Product updated successfully",
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    deleteProducts: async(req,res)=>{
        try {
            const {id} = req.params;
            await ProductModel.deleteOne({_id:id});
            return res.status(200).json({
                status:"success",
                message:"Product deleted successfully",
            })
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    listUser:async(req,res)=>{
        try {
            const users = await UserModel.find()
              .sort({_id: -1})
              .limit(15);
            return res.status(200).json({
                status: "success",
                data: users
            })
        } catch (error) {
            return res.status(400).json(error);
        }
    },
    showUser:async(req,res)=>{
        try {
            const {id} = req.params;
            const users = await UserModel.findById(id);
            return res.status(200).json({
                status:"success",
                data:users,
            })
        } catch (error) {
            return res.status(400).json(error);
        }
    },
    createUser:async(req,res)=>{
        try {
            const {body} = req;
            const user = {
                full_name: body.full_name,
                email: body.email,
                password: body.password,
                // role: body.role,
            }
            const newUser = await UserModel.findOne({email: body.email});
            if(newUser){
                req.flash("error","Email đã tồn tại");
                return res.redirect("/admin/users/create");
            }
            await UserModel(user).save();
            return res.status(200).json({
                status: "success",
                message:" user created successfully",
            })          
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    updateUser: async(req,res)=>{
        try {
            const {id} = req.params;
            const {body} = req;
            const user = {
                full_name: body.full_name,
                email: body.email,
                password: body.password,
                // role: body.role,
            };
            const updateUser = await UserModel.findOne({email: body.email, full_name: body.full_name});
            if(updateUser){
                return res.status(401).json("Email đã tồn tại, password không khớp")
            }
            await UserModel.updateOne({_id:id},{$set: user});
            return res.status(200).json({
                status:"success",
                message:"User updated successfully",
            })
        } catch (error) {
            return res.status(400).json(error);
        }
    },
    deleteUser:async(req, res)=>{
        try {
            const {id} = req.params;
            await UserModel.deleteOne({_id: id});
            return res.status(200).json({
                status: "success",
                message:"user deleted successfully",

            })
        } catch (error) {
            return res.status(400).json(error);
        }
    }
};

module.exports = AdminController;