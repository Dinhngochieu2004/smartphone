const CategoryModel = require('../../models/category');
const ProductModel = require('../../models/product');
const pagination = require("../../../libs/pagination");
const CategoryController ={
    // Trang site
    index:async(req,res)=>{    
        const categories = await CategoryModel.find().sort({_id:1});
        try {
            res.status(200).json({
                status:"success",
                data: categories,
            });
        } catch (error) {
            res.status(400).json(error);
        }
    },
    show: async(req, res)=>{
        try {
            const {id} = req.params;
            const category = await CategoryModel.findById(id);
            res.status(200).json({
                status:"success",
                data: category,
            });
        } catch (error) {
            res.status(400).json(error);
        }
    },
    categoriesProducts:async(req,res)=>{
        try {
            const { id } = req.params;
            const query = { category_id: id };
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const products = await ProductModel.find(query).sort({ _id: -1 }).skip(skip).limit(limit);
            const totalDocs = await ProductModel.countDocuments(query);
            const totalPages = Math.ceil(totalDocs / limit);

            return res.status(200).json({
                status: "success",
                filters: {
                    page,
                    limit,
                    category_id: id,
                },
                data: {
                    docs: products,
                    totalDocs,
                    totalPages,
                    currentPage: page,
                }
            });
        } catch (error) {
            return res.status(400).json(error);
        }
    },
    /// Trang Admin
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
}
module.exports = CategoryController; 