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
router.post("/categories/create",AdminController.addCategory);
router.post("/categories/:id/update",AdminController.updateCategories);
router.get("/categories/:id/delete",AdminController.deleteCategories);
//Products
router.get("/products",AdminController.listProducts);
router.post("/products/create",AdminController.createProducts);
router.post("/products/:id/update",AdminController.updateProducts);
router.get("/products/:id/delete",AdminController.deleteProducts);
//Users
router.get("/users",AdminController.listUser);
router.get("/users/:id",AdminController.showUser);
router.post("/users/create",AdminController.createUser);
router.post("/users/:id/update",AdminController.updateUser);
router.get("/users/:id/delete",AdminController.deleteUser);
//auth

module.exports = router;
