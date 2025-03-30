const ProductModel = require("../../models/product");
const CommentModel = require("../../models/comments");
const pagination = require("../../../libs/pagination");
const ProductController ={
    /// trang Site
    index :async(req, res) => {
        try {
            const query = {};
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const skip = page*limit - limit;    
            if(req.query.is_featured) query.is_featured = query.is_featured;
            if(req.query.is_stock) query.is_stock = query.is_stock;
            if(req.query.name) query.$text ={$search: req.query.name};
            const products = await ProductModel.find(query).sort({_id: -1}).skip(skip).limit(limit);
            res.status(200).json({
                status:"success",
                filters:{
                    featured: req.query.is_featured || null,
                    is_stock: req.query.is_stock || null,
                    page,
                    limit,
                },
                data:{
                    docs:[products],
                    pages:{
                        pages: await pagination(ProductModel, page, limit),
                    },
                },
            });
            
        } catch (error) {
            res.status(500).json(error);
        }
    },
    show:async(req,res)=>{
        try {
            const {id} = req.params;
            const product = await ProductModel.findById(id);
            return res.status(200).json({
                status:"success",
                data:{
                    docs:[product],
                }
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },
    comments:async(req, res)=>{
        try {
            const {id} = req.params;
            const query ={};
            query.product_id = id;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const skip = page*limit-limit;
            const comments = await CommentModel.find(query).sort({_id: -1}).skip(skip).limit(limit);
            res.status(200).json({
                status: "success",
                filters:{
                    page,
                    limit,
                    product_id: id,
                },
                data:{
                    docs: comments,
                    page: await pagination(CommentModel, limit, page, query),
                }
            });
        } catch (error) {
            res.status(400).json(error);
        }
    },
    storecomments: async(req,res)=>{
        try {
            const {id} = req.params;
            const comment = req.body;
            comment.product_id = id;
            await new CommentModel(comment).save();
            res.status(200).json({
                status: "success",
                data: comment,
            });
            
        } catch (error) {
            res.status(400).json(error);
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
}
module.exports = ProductController;