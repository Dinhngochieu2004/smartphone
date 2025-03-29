const CategoryModel = require('../../models/category');
const ProductModel = require('../../models/product');
const pagination = require("../../../libs/pagination");
const CategoryController ={
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
    }
}
module.exports = CategoryController; 