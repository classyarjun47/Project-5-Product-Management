
const express = require('express')
const multer = require('multer')
const route = require('./routes/route')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded( { extended:true } ))
app.use(multer().any())

//mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://rajput:rajput1234@arjun.spsif5o.mongodb.net/Project5?retryWrites=true&w=majority",{
            useNewUrlParser : true
        }
    )
    .then(() => console.log("MongoDb is Ready To Rock..."))
    .catch((err) => console.log(err));

    
app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app up and running on port " + (process.env.PORT || 3000));
});
