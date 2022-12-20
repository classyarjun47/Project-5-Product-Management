const express = require("express")
const router = express.Router()
const userController = require("../controller/userController")








router.post("/register" , userController.register)
router.post("/login",userController.loginUser)
router.put("/update", userController.updateUser)


module.exports=router
