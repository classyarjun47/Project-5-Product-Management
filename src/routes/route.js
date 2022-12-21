const express = require('express');
const router = express.Router();
const UserController = require("../controller/userController");
const ProductController = require("../controller/productController");
//const CartController = require("../controller/cartController")
//const OrderController = require("../controller/orderController")
const mw = require("../middleware/auth");

//**********user api ******************
router.post("/register", UserController.register);

router.post("/login", UserController.loginUser);

//router.get("/user/:userId/profile", mw.authentication, mw.authorisation, UserController.);

router.put('/user/:userId/profile', mw.auth,  UserController.updateUser);
//*************product api***************
router.post('/products', ProductController.createProduct);

router.get("/products", ProductController.getProduct);

router.get("/products/:productId", ProductController.getProductById);


router.post("/products/:productId", ProductController.updateProductById);

router.delete("/products/:productId", ProductController.deleteProductById);


module.exports = router;