//!============================***** order Api *******===========================================//
const orderModel=require("../model/orderModel")
const cartModel=require("../model/cartModel")
const validator=require("../validator/validator")
const updateOrder=async function(req,res){
    try{
        const orderId=req.body.orderId
        const userId=req.params.userId
        const status=req.body.status
        if(!req.body){
            return res.status(400).send({status:false, msg:"please provide some data"})
        }

        if(!orderId){
            return res.status(400).send({status:false, msg:"please provide orderId"})
        }

        if(!validator.isValidObjectId(orderId)){
            return res.status(400).send({status:false, msg:"please provide valid orderId"})
        }

        if(!status){
            return res.status(400).send({status:false, msg:"please provide status"})
        }

        if(status!= "cancelled" && status!="completed" && status!="pending" ){
            return res.status(400).send({status:false, msg:"status could be either cancelled, completed or pending "})
        }

        let findOrder = await orderModel.findById(orderId)

        if(!findOrder){
            return res.status(400).send({status:false, msg:"No order is found with given orderId"})
        }

        if(findOrder.isDeleted==true){
            return res.status(400).send({status:false, msg:"Order has been already deleted"})
        }

        if(status=="cancelled"){
            if(findOrder.cancellable==false){
                return res.status(400).send({status:false, msg:"you can't cancel this order"})
            }

            if(findOrder.status=="cancelled"){
                return res.status(400).send({status:false, msg:"This order is already cancelled"})
            }

            let updatedOrder=await orderModel.findOneAndUpdate({Id:orderId, status:cancelled, new:true})
            
            return res.status(200).send({status:true, msg:"success", data:updatedorder})
        }

        if(status=="completed"){
            if(findOrder.status=="completed"){
                return res.status(400).send({status:false, msg:"This order is already completed"})
            }

            if(findOrder.status=="cancelled"){
                return res.status(400).send({status:false, msg:"This order is already cancelled u cant update it"})
            }

            let updatedOrder=await ordermodel.findOneAndUpdate({id:orderId, status:completed, new:true})
            return res.status(200).send({status:true, msg:"Success", data:updatedOrder})

        }

        if(status=="pending"){
            if(findOrder.status=="pending"){
                return res.status(400).send({status:false, msg:"This order is already in pending"})
            }

            if(findOrder.status=="cancellled"){
                return res.status(400).send({status:false, msg:"This order is already cancelled you cant update it to pending"})
            }

            if(findOrder.status=="completed"){
                return res.status(400).send({status:false, msg:"This order is already completed, after completing you cant update it to pending"})
            }
        }
    }

            catch(err){
                return res.status(500).send({status:false, msg:"err.message"})
            }
        }

        module.exports.updateOrder=updateOrder






        

    
