const express = require("express");
const router = express.Router();
// import the controller
const CategoryController = require("../apps/controllers/apis/category");
const OrderController = require("../apps/controllers/apis/order");
const ProductController = require("../apps/controllers/apis/product");
const CustomerController = require("../apps/controllers/apis/customer");
const AuthController = require("../apps/controllers/apis/auth");
const AdminController = require("../apps/controllers/admin");
const AuthAdminController = require("../apps/controllers/auth.admin");
// import middlewares
const AuthMiddleware = require("../apps/middlewares/auth");
const UserController = require("../apps/controllers/apis/user");
//rourter Site
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
///Router Admin
router.get("/admin",AdminController.index);
//categories
router.post("/categories/create",CategoryController.addCategory);
router.post("/categories/:id/update",CategoryController.updateCategories);
router.get("/categories/:id/delete",CategoryController.deleteCategories);
//Products
router.post("/products/create",ProductController.createProducts);
router.post("/products/:id/update",ProductController.updateProducts);
router.get("/products/:id/delete",ProductController.deleteProducts);
//Users
router.get("/users",UserController.listUser);
router.get("/users/:id",UserController.showUser);
router.post("/users/create",UserController.createUser);
router.post("/users/:id/update",UserController.updateUser);
router.get("/users/:id/delete",UserController.deleteUser);
//auth

module.exports = router;
