const ProductModel = require("../../models/product");
const CommentModel = require("../../models/comments");
const pagination = require("../../../libs/pagination");
const ProductController ={
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
    }
}
module.exports = ProductController;