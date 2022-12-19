const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({

    title: {
        type: string,
        unique: true,
        require: true
    },

    description: {
        type: string,
        require: true
    },


    price: {
        type: number,
        require: true,
    },
    currencyId: {
        type: string,
        require: true,
        enum: ["INR"]
    },

    currencyFormat: {
        type: string,
        require: true
    },

    isFreeShipping: {
        type: boolean,
        default: false
    },
    productImage: {
        type: string,
        require: true
    },  // s3 link
    style: {
        type: string
    },

    availableSizes: {
        type: String,
        enum: ["S", "XS", "M", "X", "L", "XXL", "XL"]
    },

    installments: {
        type: number
    },

    deletedAt: {
        type: Date,
        default: null
    },

    isDeleted: {
        type: boolean,
        default: false
    },

},
    { timestamps: true })


module.exports = mongoose.model('product', productSchema)