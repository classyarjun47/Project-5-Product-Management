const express = require("express")
const mongoose = require("mongoose")



const route = require('./routes/route')
const app = express()

app.use(express.json())

mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://rajput:rajput1234@arjun.spsif5o.mongodb.net/Project5?retryWrites=true&w=majority" , {
    useNewUrlParser: true
})
.then( ()=>console.log("MongoDB is connected."))
.catch(err=>console.log(err))


app.use("/" ,route)

app.listen( 3000 , ()=>{
    console.log("Express app running on port 3000")
})
