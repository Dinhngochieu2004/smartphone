const express = require("express");
const router = express.Router();
// import the controller
const CategoryController = require("../apps/controllers/apis/category");
const OrderController = require("../apps/controllers/apis/order");
const ProductController = require("../apps/controllers/apis/product");
const CustomerController = require("../apps/controllers/apis/customer");
const AuthController = require("../apps/controllers/auth");
// import middlewares
const AuthMiddleware = require("../apps/middlewares/auth");
//rourter
//Auth
router.post("/customers/login", AuthController.loginCustomer);
router.post("/customers/register",AuthController.registerCustomer);
router.get("/auth/refresh-token",AuthController.refreshToken);
// category
router.get(`/categories`, CategoryController.index);
router.get(`/categories/:id`, CategoryController.show);
router.get("/categories/:id/products",CategoryController.categoriesProducts);
// order
router.get(`/customers/:id/orders`, OrderController.index);
router.post(`/orders`, OrderController.order); 
router.get("/orders/:id", OrderController.show);
router.patch("/orders/:id/cancelled",OrderController.cancelled);
// product
router.get(`/products`, ProductController.index);
router.get(`/products/:id`, ProductController.show);
router.get("/products/:id/comments", ProductController.comments);
router.post("/products/:id/comments",ProductController.storecomments);
// customer
router.post("/customers/:id/update", CustomerController.update);
router.post("/customers/logout",AuthMiddleware.verifyAuthenticationCustomer,AuthController.logoutCustomer);
module.exports = router;
