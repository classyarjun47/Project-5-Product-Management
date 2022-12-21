const express = require("express")
const router = express.Router()
const userController = require("../controller/userController")
const product = require("../controller/productController")
const cartController = require('../controller/cartController')
const orderController = require('../controller/orderController')
const auth = require('../middleware/auth')






router.post("/register" , userController.register)
router.post("/login",userController.loginUser)
router.put("/update", userController.updateUser)


module.exports=router
