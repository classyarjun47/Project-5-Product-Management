const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId

const orderSchema = new mongoose.Schema({

    userId: {
        type:ObjectId,
        require:true
     },

    items: [{
        productId: {
            type: ObjectId,
            ref: product,
            required: true
        },

        quantity: {
            type: number,
            required: true,
            min: 1
        }
    }],

    totalPrice: {
        type: number,
        required: true,
    },

    totalItems: {
        type: number,
        required: true
    },
    totalQuantity: {
        type: number,
        required: true
    },

    cancellable: {
        type: boolean,
        default: true
    },

    status: {
        type: string,
        default:'pending',
        enum: [pending, completed, cancled]
    },
    deletedAt: {
        type: Date,
        //default: null
    },

    isDeleted: {
        type: boolean,
        default: false
    },

},
    { timestamps: true })


module.exports = mongoose.model('order', orderSchema)